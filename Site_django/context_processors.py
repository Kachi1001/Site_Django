# myapp/context_processors.py
from math import exp
from django.utils import timezone
import time

from decouple import config
from . import util
api = str(config("API")) # type: ignore

timestamp = int(time.time()),
translate = {
    'Home': 'Inicio',
    'Lancamento_obra': 'Lancamento obra',
    'Reservas': 'Reservas',
    'Depto_pessoal': 'Departamento pessoal',
}
def base(request):
    modulo_da_view = request.resolver_match.func.__module__
    app = modulo_da_view.split('.')[0]
    media = config("MEDIA_URL") + app + '/'
    
    return {
        'nome': request.user.username,
        'api': config("API"),
        'media': media,
        'app': app,
        'app_name': translate[app] if app in translate else 'Sem nome',
        'timestamp': timestamp,
        'hojeJS': util.formatarHTML(util.get_hoje()),
        'icon': '/static/icons',
        'icon_table': "class=bi-table",
        'icon_modal': "class=bi-window-stack",
        'icon_form': 'class=bi-box-arrow-in-right' ,
        'icon_pencil': 'class=bi-pencil' ,
        'icon_file': 'class=bi-file-earmark-text',
        
        'table_height': '400'
        }