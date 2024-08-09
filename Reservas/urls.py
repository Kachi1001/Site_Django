from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="reservas"),

    path("sala/registros", views.sala_registros, name= "sala_registros"), 
    path('sala/<str:sala>', views.sala, name='sala'),
    
    path("frota/carros", views.carros, name= "carros"), 
    path("frota/munck", views.munck, name= "munck"), 
    path("frota/registros", views.munck_registros, name= "frota_registros"), 
    
]  