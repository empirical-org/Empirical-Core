from django.http import Http404, HttpResponse, JsonResponse

from .models.activity import Activity


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


def first_pass(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    prompt = Prompt.objects.get(id=prompt_id)
    response = prompt.fetch_rules_based_feedback(entry, RuleSet.PASS_ORDER.FIRST)

    return JsonResponse(response)


def second_pass(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    prompt = Prompt.objects.get(id=prompt_id)
    response = prompt.fetch_rules_based_feedback(entry, RuleSet.PASS_ORDER.SECOND)

    return JsonResponse(response)

