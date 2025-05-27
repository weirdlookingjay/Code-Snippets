from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TagViewSet, NoteViewSet,  NoteVersionListView, NoteVersionDetailView, NoteVersionRestoreView,ImageUploadView

router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'notes', NoteViewSet, basename='note')



urlpatterns = router.urls

urlpatterns += [
    path('notes/<int:pk>/versions/', NoteVersionListView.as_view(), name='note-version-list'),
    path('notes/<int:pk>/versions/<int:version_id>/', NoteVersionDetailView.as_view(), name='note-version-detail'),
    path('notes/<int:pk>/restore/<int:version_id>/', NoteVersionRestoreView.as_view(), name='note-version-restore'),
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
]