from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Game(models.Model):
    class State(models.TextChoices):
        PLAYING = "PL", _("Playing")
        GAMEOVER = "GO", _("Game Over")
        WIN = "WI", _("Win")

    state = models.CharField(
        max_length=2,
        choices=State,
        default=State.PLAYING,
    )
    width = models.SmallIntegerField(blank=False, null=False)
    height = models.SmallIntegerField(blank=False, null=False)
    mines = models.SmallIntegerField(blank=False, null=False)


class Cell(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, blank=False, null=False)
    coord_x = models.SmallIntegerField(blank=False, null=False)
    coord_y = models.SmallIntegerField(blank=False, null=False)
    mined = models.BooleanField(blank=False, null=False)
    opened = models.BooleanField(blank=False, null=False)
    flagged = models.BooleanField(blank=False, null=False)
    danger_neighbours = models.SmallIntegerField(blank=False, null=False)
