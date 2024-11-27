# myapp/context_processors.py
import time

from decouple import config
from . import util
api = str(config("API")) # type: ignore

timestamp = int(time.time()),
translate = {
    'Home': 'Inicio',
    'Lancamento_obra': 'Lançamento obra',
    'Reservas': 'Reservas',
    'Depto_pessoal': 'Departamento pessoal',
    'Obra': 'Obra'
}
def base(request):
    modulo_da_view = request.resolver_match.func.__module__
    app = modulo_da_view.split('.')[0]
    media = config("MEDIA_URL") + app + '/'
    
    return {
        # 'ambiente': config('AMBIENTE'),
        'nome': request.user.username,
        'api': config("API"),
        'media': media,
        'app': app,
        'app_name': translate[app] if app in translate else 'Sem nome',
        'timestamp': timestamp,
        'hojeJS': util.formatarHTML(util.get_hoje()),

        'icon': {
            'table': "class=bi-table",
            'modal': "class=bi-window-stack",
            'form': 'class=bi-box-arrow-in-right',
            'file': 'class=bi-file-earmark-text',
            'graph': 'class=bi-graph-up-arrow',
            },
        
        'table_height': '400'
        }