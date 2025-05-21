from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Tag, Note, CodeSnippet


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = '__all__'

class CodeSnippetSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    note = NoteSerializer(read_only=True)

    class Meta:
        model = CodeSnippet
        fields = '__all__'