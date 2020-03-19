from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Max, Min
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from ..models.feedback_history import FeedbackHistory


class SessionFeedbackHistoryView(View):
    @method_decorator(staff_member_required)
    def get(self, request):
        sessions = (FeedbackHistory.objects
                                   .values('session_id')
                                   .annotate(Min('created_at'))
                                   .annotate(Max('attempt'))
                                   .order_by('created_at__min'))
        context = {
            'sessions': [{
                'session_id': s['session_id'],
                'created_at': s['created_at__min'],
                'attempts': s['attempt__max'],
            } for s in sessions]
        }

        return render(request, 'session_feedback_history.html', context)
