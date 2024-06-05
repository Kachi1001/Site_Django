from django.db import models

# Create your models here.

class colaborador(models.Model):
    nome = models.TextField(blank=False, null=True)
    funçao = models.TextField(blank=False, null=True)
    admissao = models.DateField(blank=False, null=True)
    demissao = models.DateField(blank=True, null=True)
    tipo = models.TextField(blank=False, null=True)
    diaria = models.IntegerField(blank=True, null=True)
    observacao = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        managed = False
        db_table = 'colaborador'
        