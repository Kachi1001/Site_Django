from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "ti"),
    path('equipamentos/<str:subpage>', views.equipamentos, name='equipamentos'),
    path('colaborador/<str:subpage>', views.colaborador, name='colaborador'),
    path('estoque/<str:subpage>', views.estoque, name='estoque'),
    path('servicos/<str:subpage>', views.servicos, name='servicos'),
    

]  