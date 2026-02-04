from rest_framework import serializers

from closed_choice.serializers import ClosedChoiceSerializer
from question.models import Question


class QuestionSerializer(serializers.ModelSerializer):
    choices = ClosedChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['text', 'difficulty', 'choices']

    def get_choices(self, obj):
        if obj.question_type == Question.CLOSED:
            return ClosedChoiceSerializer(obj.choices.all(), many=True).data
        return []