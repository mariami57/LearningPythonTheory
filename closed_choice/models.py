from django.core.exceptions import ValidationError
from django.db import models

from question.models import Question


# Create your models here.
class ClosedChoice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def clean(self):
        if self.is_correct:
            qs = ClosedChoice.objects.filter(
                question=self.question,
                is_correct=True).exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError('Only one correct answer allowed.')