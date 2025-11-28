from typing import Any

from django.http import HttpRequest, JsonResponse
from django.shortcuts import render


def BuildResponse(data: dict[str, Any], status_code: int):
    response = JsonResponse(data)
    response.status_code = status_code
    return response


# Create your views here.
def start(request: HttpRequest):

    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    return BuildResponse({}, 200)


def details(request: HttpRequest, game_id: int):
    if request.method != "GET":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    return BuildResponse({}, 200)


def openCell(request: HttpRequest, game_id: int, cell_id: int):
    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    return BuildResponse({}, 200)


def flagCell(request: HttpRequest, game_id: int, cell_id: int):
    if request.method != "POST":
        return BuildResponse({"error": "Unsupported method %s" % request.method}, 405)

    return BuildResponse({}, 200)
