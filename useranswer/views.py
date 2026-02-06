from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from closed_choice.models import ClosedChoice
from question.models import Question
from useranswer.models import UserAnswer
from useranswer.services.evaluators import KeywordEvaluator
from useranswer.serializers import SubmitAllAnswerSerializer


# Create your views here.
class SubmitAllAnswersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = SubmitAllAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        results = []

        for answer_data in serializer.validated_data['answers']:
            question = Question.objects.get(
                id=answer_data['question_id'],
                topic_id=pk
            )

            if question.question_type == Question.CLOSED:
                choice = ClosedChoice.objects.get(
                    id=answer_data['choice_id'],
                    question=question
                )

                answer, _ = UserAnswer.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'selected_choice': choice}
                )

                results.append({
                    'question_id': question.id,
                    'type': 'closed',
                    'selected_choice': choice.id,
                    'correct': choice.is_correct
                })

            else:
                text = answer_data.get('text_answer', '')

                answer, _ = UserAnswer.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'text': text}
                )

                evaluator = KeywordEvaluator()
                evaluation = evaluator.evaluate(
                    question,
                    question.reference_answer,
                    text
                )

                answer.evaluated_score = evaluation['score']
                answer.evaluated_feedback = evaluation['feedback']
                answer.save()

                results.append({
                    'question_id': question.id,
                    'type': 'open',
                    'score': evaluation['score'],
                    'feedback': evaluation['feedback'],
                    'reference_answer': question.reference_answer.text
                })

        return Response({'results': results})