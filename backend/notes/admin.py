from django.contrib import admin
from .models import Tag, Note, CodeSnippet

admin.site.register(Tag)
admin.site.register(Note)
admin.site.register(CodeSnippet)