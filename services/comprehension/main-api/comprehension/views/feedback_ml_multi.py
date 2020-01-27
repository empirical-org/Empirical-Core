import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.prompt import Prompt
from ..utils import construct_feedback_payload


FEEDBACK_TYPE = 'semantic'

class MultiLabelMLFeedbackView(ApiView):
    multi_label = True

    def __init__(self, *args, **kwargs):
        self.multi_label = kwargs.pop('multi_label', self.multi_label)
        super().__init__(*args, **kwargs)

    def post(self, request):
        submission = json.loads(request.body)

        entry = submission['entry']
        prompt_id = submission['prompt_id']
        previous_feedback = submission.get('previous_feedback', [])

        prompt = get_object_or_404(Prompt, pk=prompt_id)
        feedback = prompt.fetch_auto_ml_feedback(entry,
                                                 previous_feedback,
                                                 multi_label=self.multi_label)

        response = construct_feedback_payload(feedback.feedback,
                                              FEEDBACK_TYPE,
                                              feedback.optimal,
                                              labels=feedback.combined_labels)

        return JsonResponse(response)
