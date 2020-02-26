import json

from django.http import JsonResponse

from . import ApiView
from ..models.feedback_history import FeedbackHistory


class FeedbackHistoryView(ApiView):
    def post(self, request):
        submission = json.loads(request.body)

        attempt = submission['attempt']
        entry = submission['entry']
        feedback = submission['feedback']
        prompt_id = submission['prompt_id']
        session_id = submission['session_id']

        feedback_optimal = feedback.pop('optimal')
        feedback_text = feedback.pop('feedback')
        feedback_type = feedback.pop('feedback_type')

        FeedbackHistory.objects.create(
            attempt=attempt,
            entry=entry,
            feedback=feedback,
            feedback_optimal=feedback_optimal,
            feedback_text=feedback_text,
            feedback_type=feedback_type,
            prompt_id=prompt_id,
            session_id=session_id
        )

        response = {
            'message': 'Successfully recorded Feedback History.',
        }

        return JsonResponse(response)
