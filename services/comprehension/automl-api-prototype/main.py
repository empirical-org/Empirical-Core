from google.cloud import automl_v1beta1 as automl
from flask import jsonify
from flask import make_response
import yaml

FEEDBACK_TYPE = "semantic"


def response_endpoint(request):
    request_json = request.get_json()
    log(request=request)

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)
    attempt = param_for('attempt', request, request_json) or 1

    if entry is None or prompt_id is None:
        return make_response(jsonify(feedback="error"), 400)

    model_settings = model_settings_for(prompt_id)

    if model_settings is None:
        return make_response(jsonify(feedback="error: model not found"), 400)

    automl_response = automl_prediction(entry, model_settings['automl'])
    label = label_for(automl_response.payload, model_settings['label_type'])
    feedback = feedback_for(label, model_settings['feedback'], attempt)
    optimal = label in model_settings['correct']

    log(request=request_json, label=label, feedback=feedback, optimal=optimal)

    response_data = {
        'feedback_type': FEEDBACK_TYPE,
        'response_uid': 'q23123@3sdfASDF',
        'feedback': feedback,
        'optimal': optimal,
        'highlight': [],
    }

    return make_response(jsonify(**response_data), 200)


def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    else:
        return (request_json or {}).get(key)


def model_settings_for(prompt_id):
    with open("models.yml", 'r') as ymlfile:
        configs = yaml.load(ymlfile, Loader=yaml.SafeLoader)['models']

    return configs.get(int(prompt_id))


def automl_prediction(entry, settings):
    prediction_client = automl.PredictionServiceClient()

    url_pattern = 'projects/{}/locations/{}/models/{}'
    model_url = url_pattern.format(settings['project_id'],
                                   settings['compute_region'],
                                   settings['model_id'])
    payload = {'text_snippet': {'content': entry, 'mime_type': 'text/plain'}}

    return prediction_client.predict(model_url, payload, {})


def feedback_for(label, feedback_settings, attempt):
    feedback_array = feedback_settings.get(
        label,
        feedback_settings['default_feedback'])
    odd_attempt = attempt % 2 == 1

    # TODO - This only supports two pieces of feedback
    # and pulls first or last depending on odd or even (so it alternates)
    # This is just to get multiple feedback in place for user testing
    return feedback_array[0] if odd_attempt else feedback_array[-1]


def label_for(payload, type):
    if type == 'single':
        return single_label(payload)
    return multi_label_string(payload)


def single_label(payload):
    return sorted(payload, key=scoreSort, reverse=True)[0].display_name


# For now, combine these into one label string for ease of use.
def multi_label_string(payload):
    labels = filter(above_threshold, payload)
    label_names = map(lambda x: x.display_name, labels)
    return "-".join(sorted(label_names))


def above_threshold(e):
    return e.classification.score > 0.5


def scoreSort(e):
    return e.classification.score


def log(**items):
    print(items)
