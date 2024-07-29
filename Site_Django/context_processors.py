# myapp/context_processors.py
def user(request):
    return {'nome': request.user.username}
