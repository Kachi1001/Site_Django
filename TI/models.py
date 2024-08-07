from django.db import models

class equipamentos(models.Model):
    id = models.BigAutoField(primary_key=True)
    tipo = models.CharField(max_length=255)
    tag = models.CharField(blank=True, null=True)
    aquisicao = models.DateField(blank=True, null=True)
    marca = models.CharField(blank=True, null=True)
    modelo = models.CharField(max_length=255, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'equipamentos'
    
class detalhes(models.Model):
    id = models.BigAutoField(primary_key=True)
    equipamento = models.CharField(blank=True, null=False)
    nome = models.CharField(blank=True, null=False)
    valor = models.CharField(blank=True, null=False)
    data = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'detalhes'
        
class TI_colaborador(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(blank=True, null=False)
    admissão = models.DateField(blank=True, null=True)
    setor = models.CharField(blank=True, null=False)
    funcao = models.CharField(blank=True, null=False)

    class Meta:
        managed = True
        db_table = 'colaborador'
        
class produtos(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(blank=True, null=False)
    marca = models.DateField(blank=True, null=True)
    descricao = models.CharField(blank=True, null=False)
    equipamento = models.CharField(blank=True, null=False)
    unidade = models.CharField(blank=True, null=False)
    estoque_min = models.CharField(blank=True, null=False)

    class Meta:
        managed = True
        db_table = 'produtos'
        
class estoque(models.Model):
    id = models.BigAutoField(primary_key=True)
    produto = models.CharField(blank=True, null=False)
    quantidade = models.DateField(blank=True, null=True)
    valor_total = models.CharField(blank=True, null=False)
    lote = models.CharField(blank=True, null=False)

    class Meta:
        managed = True
        db_table = 'estoque'
    
class servicos(models.Model):
    id = models.BigAutoField(primary_key=True)
    servico = models.CharField(blank=True, null=False)
    responsavel = models.DateField(blank=True, null=True)
    data_realizacao = models.CharField(blank=True, null=False)
    data_pedido = models.CharField(blank=True, null=False)
    tag = models.CharField(blank=True, null=False)
    descricao = models.CharField(blank=True, null=False)

    class Meta:
        managed = True
        db_table = 'servicos'

class adicionais(models.Model):
    id = models.BigAutoField(primary_key=True)
    servico = models.CharField(blank=True, null=False)
    nome = models.CharField(blank=True, null=False)
    valor = models.CharField(blank=True, null=False)
    data = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'adicionais'
        
class padrao(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(blank=True, null=False)
    valor = models.DateField(blank=True, null=True)
    relacionado = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'padrao'