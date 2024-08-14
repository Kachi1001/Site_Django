# myapp/context_processors.py
from decouple import config

def base(request):
    return {'nome': request.user.username, 'api':'http://'+config("API_HOST")+':'+config("API_PORT")}