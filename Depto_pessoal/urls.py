from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name=views.app),
    path("cadastros/<str:type>", views.cadastros, name=views.app+"_cadastros"),
    path("tabelas/<str:table>", views.tabelas, name=views.app+"_tabelas"),
    path("consultas/<str:table>", views.consultas, name=views.app+"_consultas"),
    path("lancamentos/<str:type>", views.lancamentos, name=views.app+"_lancamentos"),
    path("graficos/<str:type>", views.graficos, name=views.app+"_graficos"),
    path("app", views.app_menu, name=views.app+"_app"),
]