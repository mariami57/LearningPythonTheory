from django.db import models

from question.models import Question


# Create your models here.
class ReferenceAnswer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    ideal_answer = models.TextField()
    key_points = models.JSONField()

    def __str__(self):
        return self.ideal_answer
