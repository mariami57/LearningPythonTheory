from django.db import models
from learning_user.models import LearningUser
from question.models import Question, ClosedChoice


# Create your models here.
class ReferenceAnswer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    ideal_answer = models.TextField()
    key_points = models.JSONField()

    def __str__(self):
        return self.ideal_answer

class UserAnswer(models.Model):
    user = models.ForeignKey(LearningUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(ClosedChoice, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    evaluated_score = models.FloatField(null=True, blank=True)
    evaluated_feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')

    def answer_is_correct(self):
        if self.question.question_type == Question.OPEN:
            return None

        return bool(self.selected_choice and self.selected_choice.is_correct)