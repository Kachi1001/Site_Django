# myapp/context_processors.py
from django.utils import timezone

from decouple import config
from . import util
api = 'http://'+config("API_HOST")+':'+config("API_PORT") # type: ignore
media = api + '/media'
def base(request):
    return {
        'nome': request.user.username,
        'api': api ,
        'media_carros': media + '/reservas/carros/',
        'media_diarios': media + '/lancamento_obra/diarios/',
        'hojeJS': util.formatarHTML(util.get_hoje()),
        'icon': '/static/icons',
        'icon_table': "class=bi-table",
        'icon_modal': "class=bi-window-stack",
        'icon_form': 'class=bi-box-arrow-in-right' ,
        'icon_pencil': 'class=bi-pencil' ,
        'icon_file': 'class=bi-file-earmark-text',
        
        'table_height': '400'
        }