# Generated by Django 5.0.6 on 2024-06-11 14:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Lançamento_obra', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='atividade',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='colaborador',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='dia',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='diarioobra',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='etapa',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='funcao',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='indiceobra',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='lancamentos',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='localizacaoprogramada',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='obra',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='supervisor',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='tipocontrato',
            options={'managed': False},
        ),
        migrations.DeleteModel(
            name='Encarregado',
        ),
    ]
