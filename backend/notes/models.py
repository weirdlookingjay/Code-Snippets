from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, related_name='notes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
