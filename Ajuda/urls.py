from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name=views.app),
    path("menus/<str:resource>", views.menus, name=views.app+"_menus"),
]