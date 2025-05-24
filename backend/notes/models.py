from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, related_name='notes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)
    favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class CodeSnippet(models.Model):
    title = models.CharField(max_length=200)
    code = models.TextField()
    language = models.CharField(max_length=100, blank=True)
    note = models.ForeignKey(Note, on_delete=models.SET_NULL, null=True, blank=True, related_name='snippets')
    tags = models.ManyToManyField(Tag, related_name='snippets', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class NoteVersion(models.Model):
    note = models.ForeignKey('Note', on_delete=models.CASCADE, related_name='versions')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Version of {self.note.title} at {self.created_at}"