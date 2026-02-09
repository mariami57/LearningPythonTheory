from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from question.models import Question, ClosedChoice
from useranswer.models import UserAnswer
from .serializers import SubmitAllAnswerSerializer
from useranswer.services.evaluators import KeywordEvaluator
from topic.models import Topic
from django.shortcuts import render

class SubmitAllAnswersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = SubmitAllAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        results = {}

        for ans in serializer.validated_data['answers']:
            question_id = ans['question_id']
            try:
                question = Question.objects.get(id=question_id, topic_id=pk)
            except Question.DoesNotExist:
                continue


            if question.question_type == Question.CLOSED:
                choice_id = ans.get('choice_id')
                if not choice_id:
                    results[question_id] = {'correct': False, 'error': 'No choice selected'}
                    continue

                try:
                    choice = ClosedChoice.objects.get(id=choice_id, question=question)
                except ClosedChoice.DoesNotExist:
                    results[question_id] = {'correct': False, 'error': 'Invalid choice'}
                    continue

                answer, _ = UserAnswer.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'selected_choice': choice}
                )

                results[question_id] = {'correct': answer.answer_is_correct()}


            else:
                text = ans.get('text_answer', '').strip()
                answer, _ = UserAnswer.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'text': text}
                )

                evaluator = KeywordEvaluator()
                evaluation = evaluator.evaluate(
                    question=question,
                    reference_answer=question.reference_answer,
                    user_answer=text
                )

                answer.evaluated_score = evaluation['score']
                answer.evaluated_feedback = evaluation['feedback']
                answer.save()

                results[question_id] = {
                    'score': evaluation['score'],
                    'feedback': evaluation['feedback']
                }

        return Response({'results': results}, status=status.HTTP_200_OK)


@login_required
def submit_page(request, pk):
    topic = Topic.objects.get(pk=pk)
    return render(request,
                  'test_quiz.html', {'topic': topic, 'pk':pk})