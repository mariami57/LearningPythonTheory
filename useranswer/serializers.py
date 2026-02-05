from django.utils.regex_helper import Choice
from rest_framework import serializers

from closed_choice.models import ClosedChoice
from question.models import Question
from useranswer.models import UserAnswer


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['text']

class SubmitAnswerSerializer(serializers.Serializer):
    choice_id = serializers.IntegerField(required=False)
    text_answer = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        question = self.context['question']

        if question.question_type == Question.CLOSED:
            choice_id = attrs.get('choice_id')
            if not choice_id:
                raise serializers.ValidationError('A choice is required')

            try:
                choice = ClosedChoice.objects.get(
                    id=choice_id, question=question)
            except ClosedChoice.DoesNotExist:
                raise serializers.ValidationError('Invalid choice for this question')

            attrs['choice'] = choice

        elif question.question_type == Question.OPEN:
            text_answer = attrs.get('text')
            if not text_answer:
                raise serializers.ValidationError('A text answer is required for open-ended questions')

        return attrs