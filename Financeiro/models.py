# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class EpiCadastro(models.Model):
    produto = models.ForeignKey('Produto', models.DO_NOTHING, db_column='produto')
    ca = models.CharField()
    validade = models.DateField()
    observacao = models.CharField(blank=True, null=True)
    tamanho = models.CharField()
    fabricante = models.CharField()

    class Meta:
        managed = False
        db_table = 'epi_cadastro'


class EpiMovimentacao(models.Model):
    epi = models.ForeignKey('Produto', models.DO_NOTHING, db_column='epi')
    quantidade = models.DecimalField(max_digits=65535, decimal_places=65535)
    colaborador = models.IntegerField()
    cr = models.IntegerField()
    data_entrega = models.DateField()
    baixado = models.BooleanField()
    data_baixa = models.DateField(blank=True, null=True)
    devolvido = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'epi_movimentacao'
# Unable to inspect table 'obra'
# The error was: user mapping not found for "dev_front"


class Produto(models.Model):
    produto = models.CharField()
    categoria = models.CharField(blank=True, null=True)
    descricao = models.CharField(blank=True, null=True)
    durabilidade = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'produto'
