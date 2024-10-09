# myapp/context_processors.py
from django.utils import timezone

from decouple import config
from . import util
api = 'http://'+config("API_HOST")+':'+config("API_PORT") # type: ignore
midia = api + '/media'

translate = {
    'Home': 'Inicio',
    'Lancamento_obra': 'Lancamento obra',
    'Reservas': 'Reservas',
}
def base(request):
    modulo_da_view = request.resolver_match.func.__module__
    nome_do_app = modulo_da_view.split('.')[0]

    return {
        'nome': request.user.username,
        'api': api,
        'midia': midia,
        'app': nome_do_app,
        'app_name': translate[nome_do_app] if nome_do_app in translate else 'Sem nome',

        'hojeJS': util.formatarHTML(util.get_hoje()),
        'icon': '/static/icons',
        'icon_table': "class=bi-table",
        'icon_modal': "class=bi-window-stack",
        'icon_form': 'class=bi-box-arrow-in-right' ,
        'icon_pencil': 'class=bi-pencil' ,
        'icon_file': 'class=bi-file-earmark-text',
        
        'table_height': '400'
        }