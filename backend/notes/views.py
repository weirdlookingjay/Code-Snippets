from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework import viewsets
from .models import Tag, Note, CodeSnippet
from .serializers import TagSerializer, NoteSerializer, CodeSnippetSerializer
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

from rest_framework import permissions

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
         return Note.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise serializers.ValidationError('You do not own this note.')
        serializer.save()

class CodeSnippetViewSet(viewsets.ModelViewSet):
    serializer_class = CodeSnippetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CodeSnippet.objects.filter(note__user=self.request.user)     

    def perform_create(self, serializer):
        # Only allow creating a snippet for a note owned by the user
        note = serializer.validated_data.get('note')
        if note.user != self.request.user:
            raise serializers.ValidationError('You do not own this note.')
        serializer.save()

    def perform_update(self, serializer):
        note = serializer.validated_data.get('note')
        if note.user != self.request.user:
            raise serializers.ValidationError('You do not own this note.')
        serializer.save()