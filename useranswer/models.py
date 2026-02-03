from django.db import models

from learning_user.models import LearningUser
from question.models import Question


# Create your models here.
class UserAnswer(models.Model):
    user = models.ForeignKey(LearningUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.TextField()
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)