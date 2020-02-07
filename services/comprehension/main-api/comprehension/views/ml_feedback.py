import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.prompt import Prompt
from ..utils import construct_feedback_payload
from ..utils import construct_highlight_payload


FEEDBACK_TYPE = 'semantic'


class MLFeedbackView(ApiView):
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
        highlights = [construct_highlight_payload(
                          highlight_type=h.highlight_type,
                          highlight_text=h.highlight_text,
                          highlight_id=h.id,
                          start_index=h.start_index
                      ) for h in feedback.highlights.all()]

        response = construct_feedback_payload(feedback.feedback,
                                              FEEDBACK_TYPE,
                                              feedback.optimal,
                                              labels=feedback.combined_labels,
                                              highlight=highlights)

        return JsonResponse(response)
