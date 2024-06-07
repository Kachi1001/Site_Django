from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required



def login(request):
    if request.method == "GET":
        return render(request, 'login.html' )
    elif request.method == "POST":
        user = authenticate(username= request.POST.get('nome'), password= request.POST.get('senha'))
        if user:
            login_django(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {"cache": [request.POST.get('nome'), request.POST.get('senha')]})
@login_required (login_url= '/login')
def index(request):
    return render(request, 'index.html')