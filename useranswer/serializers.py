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
    choice_id = serializers.IntegerField(required=False, allow_null=True)
    text_answer = serializers.CharField(required=False, allow_blank=True)

class SubmitAllAnswerSerializer(serializers.Serializer):
    answers = SingleAnswerSerializer(many=True)

    def validate(self, attrs):
        question = self.context['question']

        if question.question_type == Question.CLOSED:
            if attrs.get('choice_id') is None:
                raise serializers.ValidationError({'choice_id': 'This field is required.'})

        else:
             if not attrs.get('text_answer'):
                 raise serializers.ValidationError({'text_answer': 'This field is required.'})

        return attrs
