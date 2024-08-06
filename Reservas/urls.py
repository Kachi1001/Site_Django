from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "salas"),
    path("reunião", views.reuniao, name= "reuniao"),
    path("atendimento", views.atendimento, name= "atendimento"),
    path("apoio", views.apoio, name= "apoio"), 
    path("lista", views.lista, name= "lista"), 
    
]  