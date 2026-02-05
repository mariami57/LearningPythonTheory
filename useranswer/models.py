from django.db import models
from django.utils.regex_helper import Choice

from closed_choice.models import ClosedChoice
from learning_user.models import LearningUser
from question.models import Question


# Create your models here.
class UserAnswer(models.Model):
    user = models.ForeignKey(LearningUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(ClosedChoice, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()
    evaluated_score = models.FloatField(null=True, blank=True)
    evaluated_feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')

    def is_correct(self):
        if self.question_type == Question.OPEN:
            return None

        return bool(self.selected_choice and self.selected_choice.is_correct)