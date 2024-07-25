from .serializers import SerializerTipo
from .models import *
from django.db import IntegrityError, transaction
from django.utils import timezone

from rest_framework.response import Response
import json   

    
