from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name= "   home"),
    path("login", views.login, name= "login"),
    path("secreto", views.secreto, name= "secreto"),
    
]