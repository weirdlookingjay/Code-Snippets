from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework import viewsets
from .models import Tag, Note, NoteVersion
from .serializers import TagSerializer, NoteSerializer, NoteVersionSerializer
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

from rest_framework import permissions

from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage

class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=400)
        # Save the file
        file_path = default_storage.save(f'uploads/{file_obj.name}', file_obj)
        file_url = default_storage.url(file_path)
        return Response({'url': request.build_absolute_uri(file_url)})
    
    
class NoteVersionListView(generics.ListAPIView):
    serializer_class = NoteVersionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['pk']
        return NoteVersion.objects.filter(note_id=note_id).order_by('-created_at')

class NoteVersionDetailView(generics.RetrieveAPIView):
    serializer_class = NoteVersionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NoteVersion.objects.all()

class NoteVersionRestoreView(generics.GenericAPIView):
    serializer_class = NoteVersionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, version_id):
        version = NoteVersion.objects.get(pk=version_id, note_id=pk)
        note = version.note
        note.content = version.content
        note.save()
        return Response({'status': 'restored'}, status=status.HTTP_200_OK)
    
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


    
    permission_classes = [permissions.IsAuthenticated]

    

    

    