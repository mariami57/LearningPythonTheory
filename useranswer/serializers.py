from django.utils.regex_helper import Choice
from rest_framework import serializers

from closed_choice.models import ClosedChoice
from question.models import Question
from useranswer.models import UserAnswer


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['text']

class SingleAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()
    text_answer = serializers.CharField(required=False, allow_blank=True)

class SubmitAllAnswerSerializer(serializers.Serializer):
    answers = SingleAnswerSerializer(many=True)
