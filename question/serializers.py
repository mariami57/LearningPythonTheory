from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from closed_choice.serializers import ClosedChoiceSerializer
from question.models import Question


class QuestionSerializer(serializers.ModelSerializer):
    choices = SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'difficulty', 'choices']

    def get_choices(self, obj):
        if obj.question_type == Question.CLOSED:
            return ClosedChoiceSerializer(obj.choices.all(), many=True).data
        return []