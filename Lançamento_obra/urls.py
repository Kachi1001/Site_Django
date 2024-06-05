from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "home"),
    path("cadastro/colaborador/", views.cadastro_colab, name= "cadastro_colab"),
    path("visualizacao/colaborador/", views.visualizacao_colab, name= "visualizacao_colab"),
]