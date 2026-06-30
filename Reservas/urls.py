from django.urls import path, re_path
from django.views.generic.base import RedirectView

# URL do novo site para onde todas as rotas de /Reservas serao redirecionadas.
NOVO_SITE_URL = "https://salas.mke.app.br/"

_redirect = RedirectView.as_view(url=NOVO_SITE_URL, permanent=True)

urlpatterns = [
    # URL nomeada "Reservas" usada pela home em {% url 'Reservas' %}.
    # Sem este name a home quebra com NoReverseMatch (erro 500).
    path("", _redirect, name="Reservas"),
    # Captura todas as demais rotas de /Reservas/* e redireciona para o novo site.
    # permanent=True -> 301 (redirecionamento permanente). Use False para 302.
    re_path(r"^.*$", _redirect),
]
