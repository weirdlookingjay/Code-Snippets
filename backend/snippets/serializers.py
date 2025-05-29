from rest_framework import serializers
from notes.models import Tag
from .models import CodeSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = CodeSnippet
        fields = ['id', 'user', 'title', 'code', 'language', 'tags', 'createdAt', 'updatedAt']
