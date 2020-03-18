from django.db.models import Min
from django.shortcuts import render
from django.views import View

from ..models.feedback_history import FeedbackHistory


class SessionFeedbackHistoryView(View):
    def get(self, request):
        sessions = (FeedbackHistory.objects
                                   .values('session_id')
                                   .annotate(Min('created_at'))
                                   .order_by('created_at__min'))
        context = {
            'sessions': [{
                'session_id': s['session_id'],
                'created_at': s['created_at__min'],
            } for s in sessions]
        }

        return render(request, 'session_feedback_history.html', context)
