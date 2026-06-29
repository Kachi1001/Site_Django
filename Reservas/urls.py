from django.urls import path, re_path
from django.views.generic.base import RedirectView

# URL do novo site para onde todas as rotas de /Reservas serao redirecionadas.
NOVO_SITE_URL = "https://salas.mke.app.br/"

urlpatterns = [
    # Captura todas as rotas de /Reservas/* e redireciona para o novo site.
    # permanent=True -> 301 (redirecionamento permanente). Use False para 302.
    re_path(r"^.*$", RedirectView.as_view(url=NOVO_SITE_URL, permanent=True)),
]
