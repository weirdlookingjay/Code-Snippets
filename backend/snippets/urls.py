from rest_framework.routers import DefaultRouter
from .views import CodeSnippetViewSet

router = DefaultRouter()
router.register(r'snippets', CodeSnippetViewSet, basename='codesnippet')

urlpatterns = router.urls
