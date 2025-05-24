from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Note, NoteVersion

@receiver(pre_save, sender=Note)
def save_note_version(sender, instance, **kwargs):
    if instance.pk:
        old_note = Note.objects.get(pk=instance.pk)
        if old_note.content != instance.content:
            NoteVersion.objects.create(
                note=instance,
                content=old_note.content,
                # Optionally set edited_by here if you have user context
            )
