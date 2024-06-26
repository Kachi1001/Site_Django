# Generated by Django 5.0.6 on 2024-06-10 11:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.BooleanField()),
                ('username', models.CharField(max_length=150, unique=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.CharField(max_length=254)),
                ('is_staff', models.BooleanField()),
                ('is_active', models.BooleanField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(max_length=200)),
                ('action_flag', models.SmallIntegerField()),
                ('change_message', models.TextField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('app', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField()),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Atividade',
            fields=[
                ('tipo', models.CharField(max_length=30, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'atividade',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Colaborador',
            fields=[
                ('nome', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('admissao', models.DateField(blank=True, null=True)),
                ('demissao', models.DateField(blank=True, null=True)),
                ('diaria', models.TextField(blank=True, null=True)),
                ('observacoes', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'colaborador',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Dia',
            fields=[
                ('data', models.DateField(primary_key=True, serialize=False)),
                ('diasemana', models.IntegerField()),
                ('feriado', models.BooleanField()),
                ('programacao', models.DateField()),
            ],
            options={
                'db_table': 'dia',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Funcao',
            fields=[
                ('funcao', models.CharField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'funcao',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Indiceobra',
            fields=[
                ('indice', models.CharField(max_length=50, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'indiceobra',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Supervisor',
            fields=[
                ('supervisor', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('ativo', models.BooleanField()),
            ],
            options={
                'db_table': 'supervisor',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Tipocontrato',
            fields=[
                ('contrato', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'tipocontrato',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Encarregado',
            fields=[
                ('encarregado', models.OneToOneField(db_column='encarregado', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Lançamento_obra.colaborador')),
            ],
            options={
                'db_table': 'encarregado',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Etapa',
            fields=[
                ('cr', models.IntegerField(primary_key=True, serialize=False)),
                ('etapa', models.IntegerField()),
                ('descricao', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'etapa',
                'managed': True,
                'unique_together': {('cr', 'etapa')},
            },
        ),
        migrations.AddField(
            model_name='colaborador',
            name='funcao',
            field=models.ForeignKey(blank=True, db_column='funcao', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.funcao'),
        ),
        migrations.CreateModel(
            name='Obra',
            fields=[
                ('cr', models.IntegerField(primary_key=True, serialize=False)),
                ('orcamento', models.CharField(max_length=20)),
                ('retrabalho', models.CharField(blank=True, max_length=20, null=True)),
                ('empresa', models.CharField(max_length=100)),
                ('cidade', models.CharField(max_length=100)),
                ('descricao', models.CharField(blank=True, null=True)),
                ('finalizada', models.BooleanField()),
                ('indice', models.CharField()),
                ('supervisor', models.ForeignKey(blank=True, db_column='supervisor', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.supervisor')),
            ],
            options={
                'db_table': 'obra',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='colaborador',
            name='contrato',
            field=models.ForeignKey(db_column='contrato', on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.tipocontrato'),
        ),
        migrations.CreateModel(
            name='Diarioobra',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('data', models.DateField()),
                ('obra', models.IntegerField(blank=True, null=True)),
                ('climamanha', models.CharField(blank=True, max_length=20, null=True)),
                ('climatarde', models.CharField(blank=True, max_length=20, null=True)),
                ('imagem', models.CharField(blank=True, max_length=255, null=True)),
                ('encarregado', models.ForeignKey(blank=True, db_column='encarregado', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.encarregado')),
            ],
            options={
                'db_table': 'diarioobra',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Lancamentos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('dia', models.DateField()),
                ('descricao', models.CharField(blank=True, max_length=600, null=True)),
                ('digito', models.IntegerField()),
                ('diaseguinte', models.BooleanField()),
                ('horaini1', models.TimeField()),
                ('horafim1', models.TimeField()),
                ('horaini2', models.TimeField(blank=True, null=True)),
                ('horafim2', models.TimeField(blank=True, null=True)),
                ('horaini3', models.TimeField(blank=True, null=True)),
                ('horafim3', models.TimeField(blank=True, null=True)),
                ('perdevale', models.BooleanField(blank=True, null=True)),
                ('revisaorh', models.CharField(blank=True, max_length=255, null=True)),
                ('etapa1', models.IntegerField(blank=True, null=True)),
                ('etapa2', models.IntegerField(blank=True, null=True)),
                ('etapa3', models.IntegerField(blank=True, null=True)),
                ('atividade', models.ForeignKey(db_column='atividade', on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.atividade')),
                ('colaborador', models.OneToOneField(db_column='colaborador', on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.colaborador')),
                ('obra', models.ForeignKey(db_column='obra', on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.obra')),
            ],
            options={
                'db_table': 'lancamentos',
                'managed': True,
                'unique_together': {('colaborador', 'dia', 'horaini1')},
            },
        ),
        migrations.CreateModel(
            name='Localizacaoprogramada',
            fields=[
                ('colaborador', models.OneToOneField(db_column='colaborador', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Lançamento_obra.colaborador')),
                ('iniciosemana', models.DateField()),
                ('observacao', models.CharField(blank=True, max_length=255, null=True)),
                ('encarregado', models.ForeignKey(blank=True, db_column='encarregado', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.encarregado')),
                ('obra', models.ForeignKey(db_column='obra', on_delete=django.db.models.deletion.DO_NOTHING, to='Lançamento_obra.obra')),
            ],
            options={
                'db_table': 'localizacaoprogramada',
                'managed': True,
                'unique_together': {('colaborador', 'iniciosemana', 'obra')},
            },
        ),
    ]
