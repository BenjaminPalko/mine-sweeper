import json
from os import waitid
from random import randrange
from typing import Any

from django.http import HttpRequest, JsonResponse
from django.shortcuts import render

from api.models import Cell, Game


def BuildResponse(data: dict[str, Any], status_code: int):
    response = JsonResponse(data)
    response.status_code = status_code
    return response


def CollectGameDetails(game: Game) -> dict:

    details = {
        "id": game.id,
        "state": game.state,
        "width": game.width,
        "height": game.height,
        "mines": game.mines,
        "cells": None,
    }

    cells: list[list[dict]] = [
        [dict() for y in range(game.height)] for x in range(game.width)
    ]
    for cell in Cell.objects.filter(game=game):

        cell_details = {
            "id": cell.id,
            "opened": cell.opened,
            "flagged": cell.flagged,
            "danger": None,
            "mined": None,
        }

        # if cell opened, show nearby mine count
        if cell.opened:
            cell_details["danger"] = cell.danger_neighbours

        # if game over, show all mined cells
        if game.State is Game.State.GAMEOVER and cell.mined:
            cell_details["mined"] = cell.mined

        cells[cell.coord_x][cell.coord_y] = cell_details

    details["cells"] = cells

    return details


# Create your views here.
def start(request: HttpRequest):
    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    json_body = json.loads(request.body)
    width, height, mines = json_body["width"], json_body["height"], json_body["mines"]

    if not width and not height:
        width, height = 9, 10

    if not mines:
        mines = width * height * 0.10

    # create game
    game = Game.objects.create(
        state=Game.State.PLAYING, width=width, height=height, mines=mines
    )
    game.save()

    # generate grid
    def generateCells(width: int, height: int):
        cells: list[list[Cell]] = []
        for x in range(width):
            col: list[Cell] = []
            for y in range(height):
                col.append(Cell.create(game, x, y))
            cells.append(col)
        return cells

    grid = generateCells(width, height)

    # set mines
    def setMine(x: int, y: int) -> bool:
        cell = grid[x][y]
        if cell.mined:
            return False
        cell.mined = True
        # increment danger of nearby cells
        offsets = [-1, 0, 1]
        for x_offset in offsets:
            x_index = x + x_offset
            if x_index < 0 or x_index >= width:
                continue
            for y_offset in offsets:
                y_index = y + y_offset
                if y_index < 0 or y_index >= height:
                    continue
                grid[x_index][y_index].danger_neighbours += 1
        return True

    mine_count = 0
    while mine_count < mines:
        x, y = randrange(width), randrange(height)
        if setMine(x, y):
            mine_count += 1

    # save cells to database
    for cellCol in grid:
        for cell in cellCol:
            cell.save()

    return BuildResponse(CollectGameDetails(game), 200)


def details(request: HttpRequest, game_id: int):
    if request.method != "GET":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    try:
        game = Game.objects.get(id=game_id)
    except Exception:
        return BuildResponse({"error": "game not found"}, 404)

    return BuildResponse(CollectGameDetails(game), 200)


def openCell(request: HttpRequest, game_id: int, cell_id: int):
    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    def isWinCondition() -> bool:
        width, height, mines = cell.game.width, cell.game.height, cell.game.mines
        return Cell.objects.filter(opened=True).count() == width * height - mines

    try:
        cell = Cell.objects.get(id=cell_id)
    except Exception:
        return BuildResponse({"error": "cell not found"}, 404)

    # you cannot modify a cell id not associated with your game
    print(cell.game)
    if cell.game.id is not game_id:
        return BuildResponse({"error": "cell id is not associated with this game"}, 400)

    # reject if game state is finished (gameover or win)
    if cell.game.state in (Game.State.GAMEOVER, Game.State.WIN):
        return BuildResponse({"error": "game is over"}, 403)

    if cell.mined:
        game = cell.game
        game.state = Game.State.GAMEOVER
        game.save()
    else:
        cell.opened = True
        cell.save()
        if isWinCondition():
            game = cell.game
            game.state = Game.State.WIN
            game.save()

    return BuildResponse(CollectGameDetails(cell.game), 200)


def flagCell(request: HttpRequest, game_id: int, cell_id: int):
    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    cell = Cell.objects.get(id=cell_id)

    try:
        cell = Cell.objects.get(id=cell_id)
    except Exception:
        return BuildResponse({"error": "cell not found"}, 404)

    # you cannot modify a cell id not associated with your game
    if cell.game.id is not game_id:
        return BuildResponse({}, 400)

    cell.flagged = not cell.flagged
    cell.save()

    return BuildResponse(CollectGameDetails(cell.game), 200)
