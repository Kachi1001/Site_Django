"""
Django settings for Site_Django project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os
from decouple import config
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-hss4fba%6y**i6$hkin&j@gp3h^^7r5*duji$-f1&(_#m6*gx#'

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = True if config('DJ_DEBUG', 1) == 1 else False

ALLOWED_HOSTS = [config("DJ_HOST"),'127.0.0.1', 'tecnikaengenharia.ddns.net', 'enjoyed-sheepdog-intense.ngrok-free.app']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin', #1
    'django.contrib.auth', #2
    'django.contrib.contenttypes', #2
    'django.contrib.sessions', #3
    'django.contrib.messages', #4
    'django.contrib.staticfiles', #5
    'rolepermissions', #6
    'Home', #7
    'Lancamento_obra',
    'Reservas',
    'TI',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

ROOT_URLCONF = 'Site_Django.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'Site_Django.context_processors.base'
            ],
        },
    },
]

WSGI_APPLICATION = 'Site_Django.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASE_ROUTERS = ['Site_Django.routers.AppRouter']
DATABASES = {}
x = 1
for app in INSTALLED_APPS[2:]:
    DATABASES[app if app != 'Home' else 'default']  = {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": app if app != 'Home' else config("DB_NAME", "Site_Django"),
        "USER": config("DB_USER", "django"),
        "PASSWORD": config("DB_PASSWORD", 'django@senha'),
        "HOST": config("DB_HOST", '127.0.0.1'),
        "PORT": config("DB_PORT", '5432'),
    }
    x = x + 1   

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'
DATE_INPUT_FORMATS = '%m/%d/%Y'

USE_I18N = True
USE_L10N = True
USE_TZ = True



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join('static')

STATICFILES_DIRS = (os.path.join(BASE_DIR, "templates/static"),)
    

MIDIA_ROOT = os.path.join(BASE_DIR, 'midia')
MIDIA_URL = '/midia/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ROLEPERMISSIONS_MODULE = "Site_Django.roles"
ROLEPERMISSIONS_REGISTER_ADMIN = True

LOGIN_URL = "/login"
