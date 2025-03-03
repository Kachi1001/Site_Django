def isHome(x):
    return x in ('Home', 'admin', 'auth', 'sessions', 'contenttypes')

class AppRouter:
    def db_for_read(self, model, **hints):
        return 'default' if isHome(model._meta.app_label) else model._meta.app_label

    def db_for_write(self, model, **hints):
        return 'default' if isHome(model._meta.app_label) else model._meta.app_label

    def allow_relation(self, obj1, obj2, **hints):
        return True  # Permite todas as relações (ajuste conforme necessário)

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == 'default' if isHome(app_label) else app_label