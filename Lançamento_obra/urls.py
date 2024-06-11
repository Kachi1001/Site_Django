from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name= "home"),
    
    path("cadastro/colaborador/", views.cadastro_colab, name= "cadastro_colab"),
    path("cadastro/função/", views.cadastro_funcao, name= "cadastro_funcao"),
    path("cadastro/obra/", views.cadastro_obra, name= "cadastro_obra"),
    path("cadastro/diario/", views.cadastro_diario, name= "cadastro_diario"),
    
    path("visualizacao/colaborador/", views.visualizacao_colab, name= "visualizacao_colab"),
    path("visualizacao/obra/", views.visualizacao_obra, name= "visualizacao_obra"),
    path("visualizacao/atividade/", views.visualizacao_atividade, name= "visualizacao_atividade"),
    
    
    path("lancamento/atividade/", views.lancamento_atividade, name= "lancamento_atividade")
]