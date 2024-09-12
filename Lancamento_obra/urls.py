from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name= "lancamento_obra"),
    path("cadastros/<str:type>", views.cadastros, name= "cadastros"),
    path("tabelas/<str:table>", views.tabelas, name= "tabelas"),
    path("consultas/<str:table>", views.consultas, name= "consultas"),
    path("lancamentos/<str:type>", views.lancamentos, name= "lancamentos"),
    path("graficos/<str:type>", views.graficos, name= "graficos"),
]