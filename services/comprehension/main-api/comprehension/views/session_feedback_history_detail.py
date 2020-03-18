from django.shortcuts import render
from django.views import View

from ..models.feedback_history import FeedbackHistory


class SessionFeedbackHistoryDetailView(View):
    def get(self, request, session_id):
        feedback_histories = (FeedbackHistory.objects
                                             .filter(session_id=session_id)
                                             .order_by('created_at'))
        context = {
            'feedback': [{
                'session_id': fh.session_id,
                'prompt_text': fh.prompt.text,
                'entry': fh.entry,
                'feedback_text': fh.feedback_text,
                'feedback_type': fh.feedback_type,
            } for fh in feedback_histories]
        }

        return render(request, 'session_feedback_history_detail.html', context)
