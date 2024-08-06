from django.db import models


class Historico(models.Model):
    id = models.BigAutoField(primary_key=True)
    idr = models.IntegerField()
    user = models.CharField(max_length=100)
    data = models.DateTimeField()
    action = models.CharField(max_length=10)
    context = models.CharField(max_length=40)

    class Meta:
        managed = True
        db_table = 'historico'