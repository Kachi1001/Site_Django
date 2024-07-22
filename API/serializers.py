from rest_framework import serializers

class SerializerTipo(serializers.Serializer):
    integer_field = serializers.IntegerField()
    string_field = serializers.CharField(max_length=200)
    boolean_field = serializers.BooleanField()

    def validate_integer_field(self, value):
        if not isinstance(value, int):
            raise serializers.ValidationError("Este campo precisa ser um número.")
        return value

    def validate_string_field(self, value):
        if not isinstance(value, str):
            raise serializers.ValidationError("Este campo precisa ser um texto.")
        return value

    def validate_boolean_field(self, value):
        if not isinstance(value, bool):
            raise serializers.ValidationError("Este campo precisa ser verdadeiro ou falso.")
        return value
