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

from rest_framework import status
from rest_framework.response import Response

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user)
        deleted = self.request.query_params.get('deleted')
        if deleted == 'true':
            queryset = queryset.filter(deleted=True)
        elif deleted == 'false':
            queryset = queryset.filter(deleted=False)
        # else: return all notes (including deleted ones)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise serializers.ValidationError('You do not own this note.')
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        force = request.query_params.get('force', 'false').lower() == 'true'
        if not force:
            # Soft delete: move to trash
            if not instance.deleted:
                instance.deleted = True
                instance.save()
                return Response({'status': 'moved to trash'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'already in trash'}, status=status.HTTP_200_OK)
        else:
            # Only allow permanent delete if already trashed
            if not instance.deleted:
                return Response({'error': 'Note must be in trash before permanent deletion.'},
                                status=status.HTTP_400_BAD_REQUEST)
            return super().destroy(request, *args, **kwargs)

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