from django.urls import path, re_path
from . import views

urlpatterns = [
    path("", views.index, name= "home"),
    path("login", views.login, name= "login"), # type: ignore
    path("teste", views.teste, name='teste'),
    path("status", views.status, name='status'),
    path("teste", views.teste),
    re_path(r'^proxy-api/(?P<path>.*)$', views.proxy_api, name='proxy_api'),
]