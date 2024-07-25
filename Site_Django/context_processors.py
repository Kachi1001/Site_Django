# myapp/context_processors.py
def user(request):
    return {'user': request.user}
