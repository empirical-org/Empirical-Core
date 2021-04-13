import json

from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.prompt import Prompt
from ..models.prompt_entry import PromptEntry
from ..utils import construct_feedback_payload
from ..utils import construct_highlight_payload


FEEDBACK_TYPE = 'autoML'


class MLFeedbackView(ApiView):
    def post(self, request):
        submission = json.loads(request.body)

        entry = submission['entry']
        prompt_id = submission['prompt_id']
        previous_feedback = submission.get('previous_feedback', [])

        prompt = get_object_or_404(Prompt, pk=prompt_id)
        try:
            PromptEntry.objects.create(entry=entry, prompt=prompt)
        except ValidationError:
            # If we are adding an entry string that already exists in the db,
            # we'll get unique constraint violation which we expect and can
            # ignore
            pass
        try:
            feedback = prompt.fetch_auto_ml_feedback(
                entry,
                previous_feedback
            )
        except Prompt.NoDefaultMLFeedbackError:
            message = f'No default feedback defined for Prompt {prompt.id}'
            return JsonResponse({'message': message}, status=500)

        highlights = [construct_highlight_payload(
                          highlight_type=h.highlight_type,
                          highlight_text=h.highlight_text,
                          highlight_id=h.id,
                          start_index=h.start_index
                      ) for h in feedback.highlights.all()]

        response = construct_feedback_payload(feedback.feedback,
                                              FEEDBACK_TYPE,
                                              feedback.optimal,
                                              feedback.id,
                                              labels=feedback.combined_labels,
                                              highlight=highlights)

        return JsonResponse(response)
