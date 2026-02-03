from rest_framework import serializers

from question.serializers import QuestionSerializer
from topic.models import Topic


class TopicSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    class Meta:
        model = Topic
        fields = '__all__'