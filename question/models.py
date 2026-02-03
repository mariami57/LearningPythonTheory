from django.db import models

from topic.models import Topic


# Create your models here.
class Question(models.Model):

    OPEN = 'open'
    CLOSED = 'closed'

    QUESTION_TYPES = [
        (OPEN, 'Open'),
        (CLOSED, 'Closed'),
    ]

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(choices=QUESTION_TYPES, max_length=10)
    difficulty = models.IntegerField(default=1)