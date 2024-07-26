from django.shortcuts import render
from Home.models import *

# Create your views here.
def index(request):
    return render(request, 'ti/index.html')