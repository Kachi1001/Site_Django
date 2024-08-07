from django.urls import path
from . import views

urlpatterns = [
    path("salas", views.salas, name= "salas"),
    path("sala/registros", views.registros, name= "registros"), 
    path('sala/<str:sala>', views.sala, name='sala'),
    
]  