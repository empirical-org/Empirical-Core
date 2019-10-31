from google.cloud import automl_v1beta1 as automl
from flask import jsonify
from flask import make_response
import yaml

def response_endpoint(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    model_settings = model_settings_for(prompt_id)

    if model_settings == None:
      return make_response(jsonify(message="error: model not found"), 400)

    automl_response = automl_prediction(entry, model_settings['automl'])
    prediction_labels = labels_for(automl_response.payload, model_settings['label_type'])
    feedback = feedback_for(prediction_labels, model_settings['feedback'], model_settings['label_type'])

    log(request=request_json, labels=prediction_labels, feedback=feedback)

    return make_response(jsonify(message=feedback,correct=True), 200)

def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    elif request_json and key in request_json:
        return request_json[key]
    else:
        return None

def model_settings_for(prompt_id):
    with open("models.yml", 'r') as ymlfile:
      configs = yaml.load(ymlfile)['models']

    if prompt_id in configs:
        return configs[prompt_id]
    else:
        return None

def automl_prediction(entry, settings):
    prediction_client = automl.PredictionServiceClient()

    model_url = 'projects/{}/locations/{}/models/{}'.format(settings['project_id'], settings['compute_region'], settings['model_id'])
    payload = {'text_snippet': {'content': entry, 'mime_type': 'text/plain' }}

    return prediction_client.predict(model_url, payload, {})

def feedback_for(labels, feedback_settings, type):
    if type == 'single':
      label = labels
    else:
      label = "-".join(sorted(labels))

    if label in feedback_settings:
      return feedback_settings[label]
    else:
      return feedback_settings['default_feedback']

def labels_for(payload, type):
    return single_label(payload) if type == 'single' else multi_labels(payload)

def single_label(payload):
    return sorted(payload, key=scoreSort, reverse=True)[0].display_name

def multi_labels(payload):
    labels = filter(above_threshold, payload)
    return map(lambda x: x.display_name, labels)

def above_threshold(e):
    return e.classification.score > 0.5

def scoreSort(e):
    return e.classification.score

def log(**items):
    print(items)
