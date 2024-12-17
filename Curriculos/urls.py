from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name=views.app),
    path("cadastros/<str:resource>", views.cadastros, name=views.app+"_cadastros"),
    path("tabelas/<str:resource>", views.tabelas, name=views.app+"_tabelas"),
    path("consultas/<str:resource>", views.consultas, name=views.app+"_consultas"),
    path("lancamentos/<str:resource>", views.lancamentos, name=views.app+"_lancamentos"),
    path("graficos/<str:resource>", views.graficos, name=views.app+"_graficos"),
    path("app", views.app_menu, name=views.app+"_app"),
]