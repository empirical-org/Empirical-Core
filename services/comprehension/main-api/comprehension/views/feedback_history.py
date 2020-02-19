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

        FeedbackHistory.objects.create(
            attempt=attempt,
            entry=entry,
            feedback=feedback,
            prompt_id=prompt_id,
            session_id=session_id
        )

        response = {
            'message': 'Successfully recorded Feedback History.',
        }

        return JsonResponse(response)
