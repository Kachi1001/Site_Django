from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name=views.app),
    path("cadastros/<str:resource>", views.cadastros, name= "cadastros"),
    path("tabelas/<str:resource>", views.tabelas, name= "tabelas"),
    path("consultas/<str:resource>", views.consultas, name= "consultas"),
    path("lancamentos/<str:resource>", views.lancamentos, name= "lancamentos"),
    path("graficos/<str:resource>", views.graficos, name= "graficos"),
]