# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Atividade(models.Model):
    tipo = models.CharField(primary_key=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'atividade'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Colaborador(models.Model):
    nome = models.CharField(max_length=255)
    admissao = models.DateField(blank=True, null=True)
    demissao = models.DateField(blank=True, null=True)
    diaria = models.TextField(blank=True, null=True)  # This field type is a guess.
    observacoes = models.CharField(max_length=255, blank=True, null=True)
    funcao = models.ForeignKey('Funcao', models.DO_NOTHING, db_column='funcao', blank=True, null=True)
    contrato = models.ForeignKey('Tipocontrato', models.DO_NOTHING, db_column='contrato')
    encarregado = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'colaborador'


class Dia(models.Model):
    dia = models.DateField(primary_key=True)
    diasemana = models.IntegerField()
    feriado = models.BooleanField()
    programacao = models.DateField()

    class Meta:
        managed = False
        db_table = 'dia'


class Diarias(models.Model):
    colaborador = models.CharField(max_length=255, blank=True, null=True)
    diarias = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    horas = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    competencia = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'diarias'


class Diarioobra(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    data = models.DateField()
    obra = models.IntegerField(blank=True, null=True)
    encarregado = models.CharField(max_length=100, blank=True, null=True)
    climamanha = models.CharField(max_length=20, blank=True, null=True)
    climatarde = models.CharField(max_length=20, blank=True, null=True)
    imagem = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'diarioobra'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Etapa(models.Model):
    cr = models.IntegerField(primary_key=True)  # The composite primary key (cr, etapa) found, that is not supported. The first column is selected.
    etapa = models.IntegerField()
    descricao = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'etapa'
        unique_together = (('cr', 'etapa'),)


class Funcao(models.Model):
    funcao = models.CharField(primary_key=True, max_length=100)
    grupo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'funcao'


class Historico(models.Model):
    idr = models.IntegerField()
    user = models.CharField(max_length=100)
    data = models.DateTimeField()
    action = models.CharField(max_length=50)
    context = models.CharField()

    class Meta:
        managed = False
        db_table = 'historico'


class Indiceobra(models.Model):
    indice = models.CharField(primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'indiceobra'


class JuntaPorDia(models.Model):
    dia = models.DateField(blank=True, null=True)
    colaborador = models.CharField(max_length=255, blank=True, null=True)
    atestado = models.DurationField(blank=True, null=True)
    atividade_obra = models.DurationField(blank=True, null=True)
    dispensa = models.DurationField(blank=True, null=True)
    falta = models.DurationField(blank=True, null=True)
    ferias = models.DurationField(blank=True, null=True)
    folga = models.DurationField(blank=True, null=True)
    treinamento = models.DurationField(blank=True, null=True)
    he100 = models.IntegerField(blank=True, null=True)
    he50 = models.IntegerField(blank=True, null=True)
    hn = models.IntegerField(blank=True, null=True)
    obra = models.IntegerField(blank=True, null=True)
    ate2 = models.DurationField(blank=True, null=True)
    atv2 = models.DurationField(blank=True, null=True)
    d2 = models.DurationField(blank=True, null=True)
    fl2 = models.DurationField(blank=True, null=True)
    fe2 = models.DurationField(blank=True, null=True)
    fo2 = models.DurationField(blank=True, null=True)
    tr2 = models.DurationField(blank=True, null=True)
    totalmax = models.DurationField(blank=True, null=True)
    totalparc = models.DurationField(blank=True, null=True)
    uteis = models.DurationField(blank=True, null=True)
    he_100 = models.DurationField(blank=True, null=True)
    he_50 = models.DurationField(blank=True, null=True)
    hesaldo = models.DurationField(blank=True, null=True)
    dcid = models.TextField(blank=True, null=True)
    iddcid = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'junta_por_dia'


class LancIncompletos(models.Model):
    dia = models.DateField(blank=True, null=True)
    nome = models.CharField(max_length=255, blank=True, null=True)
    total_horas = models.DurationField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lanc_incompletos'


class Lancamentos(models.Model):
    obra = models.ForeignKey('Obra', models.DO_NOTHING, db_column='obra')
    colaborador = models.CharField(max_length=255)
    dia = models.DateField()
    descricao = models.CharField(max_length=600, blank=True, null=True)
    digito = models.IntegerField()
    diaseguinte = models.BooleanField()
    horaini1 = models.TimeField()
    horafim1 = models.TimeField()
    horaini2 = models.TimeField(blank=True, null=True)
    horafim2 = models.TimeField(blank=True, null=True)
    horaini3 = models.TimeField(blank=True, null=True)
    horafim3 = models.TimeField(blank=True, null=True)
    atividade = models.ForeignKey(Atividade, models.DO_NOTHING, db_column='atividade')
    perdevale = models.BooleanField(blank=True, null=True)
    revisaorh = models.CharField(max_length=255, blank=True, null=True)
    etapa1 = models.IntegerField(blank=True, null=True)
    etapa2 = models.IntegerField(blank=True, null=True)
    etapa3 = models.IntegerField(blank=True, null=True)
    diario = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lancamentos'


class Localizacaoprogramada(models.Model):
    colaborador = models.CharField(primary_key=True, max_length=255)  # The composite primary key (colaborador, iniciosemana, obra) found, that is not supported. The first column is selected.
    iniciosemana = models.DateField()
    encarregado = models.CharField(max_length=100, blank=True, null=True)
    observacao = models.CharField(max_length=255, blank=True, null=True)
    obra = models.ForeignKey('Obra', models.DO_NOTHING, db_column='obra')

    class Meta:
        managed = False
        db_table = 'localizacaoprogramada'
        unique_together = (('colaborador', 'iniciosemana', 'obra'),)


class Obra(models.Model):
    cr = models.IntegerField(primary_key=True)
    orcamento = models.CharField(max_length=20)
    retrabalho = models.CharField(max_length=20, blank=True, null=True)
    empresa = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    descricao = models.CharField(max_length=500, blank=True, null=True)
    supervisor = models.ForeignKey('Supervisor', models.DO_NOTHING, db_column='supervisor', blank=True, null=True)
    finalizada = models.BooleanField()
    indice = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'obra'


class ResumoJunta(models.Model):
    dia = models.DateField(blank=True, null=True)
    colaborador = models.CharField(max_length=255, blank=True, null=True)
    obra = models.IntegerField(blank=True, null=True)
    uteis = models.DurationField(blank=True, null=True)
    naoutil = models.BigIntegerField(blank=True, null=True)
    total_he50 = models.DurationField(blank=True, null=True)
    total_he100 = models.DurationField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resumo_junta'


class Supervisor(models.Model):
    supervisor = models.CharField(primary_key=True, max_length=100)
    ativo = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'supervisor'


class Tipocontrato(models.Model):
    contrato = models.CharField(primary_key=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'tipocontrato'
