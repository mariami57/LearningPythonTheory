from rest_framework import permissions
from rest_framework.generics import ListAPIView

from question.models import Question
from question.serializers import QuestionSerializer
from topic.models import Topic
from topic.serializers import TopicSerializer


# Create your views here.
class TopicViewList(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TopicSerializer
    queryset = Topic.objects.all()



class TopicQuestionSet(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        topic_id = self.kwargs['pk']
        return (
            Question.objects.filter(topic_id=topic_id)
            .prefetch_related('choices')

        )


