# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AgendaSalas(models.Model):
    id = models.BigAutoField(primary_key=True)
    sala = models.CharField(max_length=100)
    data = models.DateField()
    responsavel = models.CharField(max_length=20)
    reservado = models.CharField(max_length=20, blank=True, null=True)
    hora = models.CharField(max_length=10, blank=True, null=True)
    descricao = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'agenda_salas'
        
class AgendaCarros(models.Model):
    id = models.BigAutoField(primary_key=True)
    carro = models.CharField(max_length=100)
    data = models.DateField()
    responsavel = models.CharField(max_length=20)
    destino = models.CharField(max_length=10, blank=True, null=True)
    reservado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'agenda_carros'
        
class Carros(models.Model):
    placa = models.CharField(max_length=9,primary_key=True)
    modelo = models.CharField(max_length=20,blank=True,null=True)
    marca = models.CharField(max_length=20,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'carros'

