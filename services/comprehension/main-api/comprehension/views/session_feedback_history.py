from django.contrib.postgres.aggregates import ArrayAgg
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Min
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from ..models.feedback_history import FeedbackHistory


class SessionFeedbackHistoryView(View):
    @method_decorator(staff_member_required)
    def get(self, request):
        sessions = (FeedbackHistory.objects
                                   .exclude(session_id='')
                                   .values('session_id')
                                   .annotate(Min('created_at'))
                                   .annotate(Count('attempt'))
                                   .order_by('created_at__min'))
        context = {
            'sessions': [{
                'session_id': s['session_id'],
                'created_at': s['created_at__min'],
                'attempts': s['attempt__count'],
                'prompt_ids': self._get_prompt_ids(s['session_id']),
            } for s in sessions]
        }

        return render(request, 'session_feedback_history.html', context)

    def _get_prompt_ids(self, session_id):
        aggregate = ArrayAgg('prompt_id', distinct=True)
        query = (FeedbackHistory.objects
                                .filter(session_id=session_id)
                                .aggregate(prompt_ids=aggregate))
        prompt_ids = query['prompt_ids']
        return ', '.join(str(id) for id in prompt_ids)
