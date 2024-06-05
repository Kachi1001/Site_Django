from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "home"),
    path("cadastro/colaborador/", views.cadastro_colab, name= "cadastro_colab"),
    path("visualizacao/colaborador/", views.visualizacao_colab, name= "visualizacao_colab"),
    path("edit/colaborador/<int:id>", views.edit_colab, name= "edit_colab"),
]