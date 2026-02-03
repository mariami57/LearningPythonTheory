from django.urls import path, include

from topic.views import TopicViewList, TopicQuestionSet

urlpatterns = [
    path('all-topics/', TopicViewList.as_view(), name='all_topics'),
    path('<int:pk>/', include([
        path('questions/', TopicQuestionSet.as_view(), name='question_set'),
        ]),
    ),

]