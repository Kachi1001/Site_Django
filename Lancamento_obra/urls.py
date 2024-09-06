from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name= "lancamento_obra"),
    path("cadastro/<str:type>", views.cadastro, name= "cadastro"),
    path("visualizacao/<str:table>", views.visualizacao, name= "visualizacao"),
    path("lancamento/<str:type>", views.lancamento, name= "lancamento"), # type: ignore
]