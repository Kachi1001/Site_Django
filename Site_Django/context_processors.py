# myapp/context_processors.py
from decouple import config
ip = 'http://'+config("API_HOST")+':'+config("API_PORT")
api = ip + '/api'
media = '/media'
def base(request):
    return {
        'nome': request.user.username,
        'api': api ,
        'media_carros': media + '/reservas/carros',
        'media_diarios': media + '/lancamento_obra/diarios/',
        
        
        'icon_table': "class=bi-table",
        'icon_modal': "class=bi-window-stack",
        'icon_form': 'class=bi-box-arrow-in-right' ,
        
        'table_height': '350'
        }