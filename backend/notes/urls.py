from rest_framework.routers import DefaultRouter
from .views import TagViewSet, NoteViewSet, CodeSnippetViewSet

router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'snippets', CodeSnippetViewSet)


urlpatterns = router.urls