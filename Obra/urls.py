from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name=views.app),
    # path("cadastros/<str:resource>", views.cadastros, name= f"{views.app}-cadastros"),
    path("consultas/<str:resource>", views.consultas, name= f"{views.app}-consultas"),
    # path("lancamentos/<str:resource>", views.lancamentos, name= f"{views.app}-lancamentos"),
    
    # path("tabelas/<str:resource>", views.tabelas, name= f"{views.app}-tabelas"),
    # path("graficos/<str:resource>", views.graficos, name= f"{views.app}-graficos"),
]