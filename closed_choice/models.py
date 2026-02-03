from django.db import models

from question.models import Question


# Create your models here.
class ClosedChoice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

