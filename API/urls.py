from django.urls import path
from . import views

urlpatterns = [
    path('executar_funcao_geraViewJunta', views.executar_funcao_geraViewJunta, name='executar_funcao_geraViewJunta'),
    path('criarFuncao', views.criarFuncao, name='criarFuncao'),
    
]