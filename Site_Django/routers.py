class AppRouter:
    """
    Um roteador para controlar a leitura e escrita de bancos de dados para apps específicos.
    """

    def db_for_read(self, model, **hints):
        """
        Direciona leituras dos modelos de `app2` para o banco de dados `secondary`.
        """
        if model._meta.app_label == 'app2':
            return 'secondary'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Direciona gravações dos modelos de `app2` para o banco de dados `secondary`.
        """
        if model._meta.app_label == 'app2':
            return 'secondary'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Permitir relações se os dois objetos estiverem no banco de dados `secondary` ou `default`.
        """
        db_list = ('default', 'secondary')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Garantir que a aplicação `app2` apenas aparece no banco de dados `secondary`.
        """
        if app_label == 'app2':
            return db == 'secondary'
        return db == 'default'
