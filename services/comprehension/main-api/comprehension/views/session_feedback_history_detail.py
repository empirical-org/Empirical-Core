from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from ..models.feedback_history import FeedbackHistory


class SessionFeedbackHistoryDetailView(View):
    @method_decorator(staff_member_required)
    def get(self, request, session_id):
        feedback_histories = (FeedbackHistory.objects
                                             .filter(session_id=session_id)
                                             .order_by('created_at'))
        context = {
            'session_id': session_id,
            'feedback': [{
                'prompt_text': fh.prompt.text,
                'attempt': fh.attempt,
                'entry': fh.entry,
                'feedback_text': fh.feedback_text,
                'feedback_type': fh.feedback_type,
            } for fh in feedback_histories]
        }

        return render(request, 'session_feedback_history_detail.html', context)
