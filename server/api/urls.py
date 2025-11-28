from django.urls import path

from . import views

urlpatterns = [
    path("start/", views.start, name="start"),
    path("<int:game_id>/", views.details, name="details"),
    path("<int:game_id>/cell/<int:cell_id>/open", views.openCell, name="open"),
    path("<int:game_id>/cell/<int:cell_id>/flag", views.flagCell, name="flag"),
]
