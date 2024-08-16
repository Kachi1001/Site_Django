# myapp/context_processors.py
from decouple import config
ip = 'http://'+config("API_HOST")+':'+config("API_PORT")
api = ip + '/api'
media = api + '/media'
def base(request):
    return {
        'nome': request.user.username,
        'api': api ,
        'media_carros': media + '/reservas/carros'
        }