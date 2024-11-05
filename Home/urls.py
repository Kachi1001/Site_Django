from tkinter import N
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "home"),
    path("login", views.login, name= "login"), # type: ignore
    path("teste", views.teste, name='teste'),
    path("status", views.status, name='status'),
    path("teste", views.teste)
]