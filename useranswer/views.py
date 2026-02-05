from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from question.models import Question
from useranswer.models import UserAnswer
from useranswer.serializers import SubmitAnswerSerializer
from useranswer.services.evaluators import KeywordEvaluator


# Create your views here.
@login_required
def answer_test_page(request, pk):
    return render(request, 'test_quiz.html', context={'topic_id': pk})

class SubmitAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, topic_id):
        question_id = request.data.get('question_id')
        if not question_id:
            return Response({"error": "question_id is missing"}, status=400)

        try:
            question = Question.objects.get(id=question_id, topic_id=topic_id)
        except Question.DoesNotExist:
            return Response({"error": "Question not found for this topic"}, status=404)

        serializer = SubmitAnswerSerializer(
            data=request.data, context={'question': question}
        )
        serializer.is_valid(raise_exception=True)

        if question.question_type == Question.CLOSED:
            answer, _ = UserAnswer.objects.update_or_create(
                user=request.user,
                question=question,
                defaults={'selected_choice': serializer.validated_data['choice']}
            )
            score = answer.is_correct()
            feedback = None
        else:
            text_answer = serializer.validated_data['text']
            answer, _ = UserAnswer.objects.update_or_create(
                user=request.user,
                question=question,
                defaults={'text': text_answer}
            )

            evaluator = KeywordEvaluator()
            evaluation = evaluator.evaluate(
                question=question,
                reference_answer=question.reference_answer,
                user_answer=text_answer,
            )

            answer.evaluated_score = evaluation['score']
            answer.evaluated_feedback = evaluation['feedback']
            answer.save()

            score = evaluation['score']
            feedback = evaluation['feedback']

        return Response({
            'question_id': question.id,
            'created_at': answer.created_at,
            'correct': score if question.question_type == Question.CLOSED else None,
            'score': score,
            'feedback': feedback
        })

