from django.core.exceptions import ValidationError
from django.db import models

from question.models import Question


# Create your models here.
class ClosedChoice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['question'],
                condition=models.Q(is_correct=True),
                name='one_correct_choice_per_question'
            )
        ]