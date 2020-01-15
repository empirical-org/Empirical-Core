import json

from django.http import Http404, HttpResponse, JsonResponse

from .models.activity import Activity
from .models.ml_feedback import MLFeedback
from .models.prompt import Prompt
from .utils import construct_feedback_payload


def index(request):
    return HttpResponse("This could return something helpful!")


def list_activities(request):
    activities = Activity.objects.all()
    return HttpResponse(f"There are {len(activities)} Activities in the DB")


def show_activity(request, id):
    try:
        activity = Activity.objects.get(pk=id)
    except Activity.DoesNotExist:
        raise Http404
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


def get_multi_label_ml_feedback(request):
    submission = json.loads(request.body)
    prompt_id = submission['prompt_id']
    entry = submission['entry']

    prompt = Prompt.objects.get(pk=prompt_id)
    feedback = prompt.fetch_auto_ml_feedback(entry)

    return JsonResponse(construct_feedback_payload(feedback.feedback,
                                                   'auto_ml_semantic',
                                                   feedback.optimal))


def get_single_label_ml_feedback(request):
    submission = json.loads(request.body)
    prompt_id = submission['prompt_id']
    entry = submission['entry']

    prompt = Prompt.objects.get(pk=prompt_id)
    feedback = prompt.fetch_auto_ml_feedback(entry, multi_label=False)

    return JsonResponse(construct_feedback_payload(feedback.feedback,
                                                   'auto_ml_semantic',
                                                   feedback.optimal))
