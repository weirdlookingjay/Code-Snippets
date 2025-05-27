from rest_framework import serializers
from notes.models import Tag
from .models import CodeSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CodeSnippet
        fields = '__all__'
