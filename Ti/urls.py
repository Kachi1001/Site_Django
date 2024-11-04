from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name=views.app),
    path('maquina/<str:subpage>', views.maquina, name='equipamentos'),
    path('colaborador/<str:subpage>', views.colaborador, name='colaborador'),
    path('estoque/<str:subpage>', views.estoque, name='estoque'),
    path('servicos/<str:subpage>', views.servicos, name='servicos'),
    path('app', views.app_menu, name=f'{views.app}_app'),
    
]  