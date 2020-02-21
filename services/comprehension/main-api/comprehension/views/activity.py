from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.activity import Activity


class ActivityView(ApiView):
    def get(self, request, id):
        activity = get_object_or_404(Activity, pk=id)
        passages = activity.get_passages()
        prompts = activity.get_prompts()
        data = {
            'activity_id': activity.id,
            'title': activity.title,
            'passages': [passage.text for passage in passages],
            'prompts': [{
                'prompt_id': prompt.id,
                'text': prompt.text,
                'max_attempts': prompt.max_attempts,
                'max_attempts_feedback': prompt.max_attempts_feedback,
            } for prompt in prompts]
        }
        return JsonResponse(data)
