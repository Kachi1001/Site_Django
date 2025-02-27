# myapp/context_processors.py
from datetime import date
import time

from decouple import config
from django.shortcuts import redirect

import Ajuda.models
api = str(config("API")) # type: ignore
import Ajuda
timestamp = int(time.time()),
def base(request):
    modulo_da_view = request.resolver_match.func.__module__
    app = modulo_da_view.split('.')[0]
    
    apps = Ajuda.models.App.objects.all().values()
    try:
        app_name = apps.get(id = app)['nome']
    except:
        app_name = 'Sem nome'
    media = config("MEDIA_URL") + app + '/'
    token = request.session.get('api_token') or None 
    return {
        # 'ambiente': config('AMBIENTE'),
        'nome': request.user.username,
        # 'user': request.user,
        'api': config("API"),
        'api_external': config("API_EXTERNAL"),
        'media': media,
        'app': app,
        'app_name': app_name,
        'timestamp': timestamp,
        'hojeJS': date.today().strftime('%Y-%m-%d'),
        'hoje': date.today().strftime('%Y-%m-%d'),
        'competencia': date.today().strftime('%Y-%m'),
        'token': token,
        'icon': {
            'table': "class=bi-table",
            'modal': "class=bi-window-stack",
            'form': 'class=bi-box-arrow-in-right',
            'file': 'class=bi-file-earmark-text',
            'graph': 'class=bi-graph-up-arrow',
            },
        
        'table_height': '400',
        'ambiente': config('AMBIENTE_PERM'),
        'apps': apps,
        }
    