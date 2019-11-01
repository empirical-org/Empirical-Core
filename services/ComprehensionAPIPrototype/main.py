from google.cloud import automl_v1beta1 as automl
from flask import jsonify
from flask import make_response
import yaml

def response_endpoint(request):
    request_json = request.get_json()
    log(request=request)

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    model_settings = model_settings_for(prompt_id)

    if model_settings == None:
      return make_response(jsonify(message="error: model not found"), 400)

    automl_response = automl_prediction(entry, model_settings['automl'])
    label = label_for(automl_response.payload, model_settings['label_type'])
    feedback = feedback_for(label, model_settings['feedback'])
    correct = label in model_settings['correct']

    log(request=request_json, label=label, feedback=feedback, correct=correct)

    return make_response(jsonify(message=feedback, correct=correct, label=label), 200)

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

    if int(prompt_id) in configs:
        return configs[prompt_id]
    else:
        return None

def automl_prediction(entry, settings):
    prediction_client = automl.PredictionServiceClient()

    model_url = 'projects/{}/locations/{}/models/{}'.format(settings['project_id'], settings['compute_region'], settings['model_id'])
    payload = {'text_snippet': {'content': entry, 'mime_type': 'text/plain' }}

    return prediction_client.predict(model_url, payload, {})

def feedback_for(label, feedback_settings):
    if label in feedback_settings:
      return feedback_settings[label]
    else:
      return feedback_settings['default_feedback']

def label_for(payload, type):
    return single_label(payload) if type == 'single' else multi_label_string(payload)

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
