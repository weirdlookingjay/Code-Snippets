from django.db import models

from django.conf import settings
from notes.models import Tag

class CodeSnippet(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='snippets')
    title = models.CharField(max_length=200)
    code = models.TextField()
    language = models.CharField(max_length=100, blank=True)
    tags = models.ManyToManyField(Tag, related_name='snippets', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
