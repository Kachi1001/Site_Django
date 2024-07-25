from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name= "lancamento_obra"),
    
    path("cadastro/colaborador/", views.cadastro_colab, name= "cadastro_colab"),
    path("cadastro/outros/", views.cadastro_outros, name= "cadastro_outros"),
    path("cadastro/obra/", views.cadastro_obra, name= "cadastro_obra"),
    
    path("visualizacao/colaborador/", views.visualizacao_colab, name= "visualizacao_colab"),
    path("visualizacao/obra/", views.visualizacao_obra, name= "visualizacao_obra"),
    path("visualizacao/diario/", views.visualizacao_diario, name= "visualizacao_diario"),
    path("visualizacao/atividade/", views.visualizacao_atividade, name= "visualizacao_atividade"),
    path("visualizacao/hora_horaextra/", views.visualizacao_hora_horaextra, name= "visualizacao_hora_horaextra"),
    
    path("lancamento/atividade/", views.lancamento_atividade, name= "lancamento_atividade"),
    path("lancamento/diario/", views.lancamento_diario, name= "lancamento_diario"),

    path("pesquisa/historico_colab/", views.pesquisa_historico_colab, name= "pesquisa_historico_colab"),
    path("pesquisa/historico_obra/", views.pesquisa_historico_obra, name= "pesquisa_historico_obra"),
    path("pesquisa/atividade_diario/", views.pesquisa_atividade_diario, name= "pesquisa_atividade_diario"),
    
    
]