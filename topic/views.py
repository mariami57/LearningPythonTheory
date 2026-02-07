from rest_framework import permissions
from rest_framework.generics import ListAPIView


from topic.models import Topic
from topic.serializers import TopicSerializer


# Create your views here.
class TopicViewList(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TopicSerializer
    queryset = Topic.objects.all()



