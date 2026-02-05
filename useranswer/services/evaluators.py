from abc import ABC, abstractmethod


class AnswerEvaluator(ABC):
    @abstractmethod
    def evaluate(self, question, reference_answer, user_answer):
        """
        Returns:
        {
            "score": float,
            "feedback": str
        }
        """
        pass

class KeywordEvaluator(AnswerEvaluator):
    def evaluate(self, question, reference_answer, user_answer):
        key_points = question.key_points or []
        matched = [
            kp for kp in key_points if kp.lower() in user_answer.lower()
        ]

        score = (len(matched) / len(key_points) *10) if key_points else 0

        missing = set(key_points) - set(matched)

        feedback = (
            f'Covered concepts: {', '.join(matched)}\n'
            f'Missing concepts: {", ".join(missing)}\n'
        )

        return {
            'score': round(score, 1),
            'feedback': feedback
        }