# serializers.py

from rest_framework import serializers
from question.models import Question
from closed_choice.models import ClosedChoice

class SingleAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField(required=False, allow_null=True)
    text_answer = serializers.CharField(required=False, allow_blank=True)

class SubmitAllAnswerSerializer(serializers.Serializer):
    answers = SingleAnswerSerializer(many=True)
