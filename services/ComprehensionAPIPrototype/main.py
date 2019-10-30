from google.cloud import automl_v1beta1 as automl
from flask import jsonify
from flask import make_response
import yaml

LABELS = {
  "greenhouse_general" : 'Greenhouse gases are a concern. Include specific stats to make a stronger argument.',
  "greenhouse_specifc" : 'You are correct! Well done!',
  "harms_animals" : "It does harm animals",
  "outside_scope" : "Your answer is outside the scope of this article. Use evidence from the passage to make your argument",
  "because_as_prep" : "Maybe because isn't the right preposition to use here.",
  "harms_env_no_mention" : "It does harm the environment, but include why that is bad",
  "plagiarism" : "It seems you've copied directly from the passage, try to write in your own words",
  "irrelevant" : "It seems that your answer is irrelevant",
  "insufficient" : "Your answer is short and insufficent, please try again"
}


def response_endpoint(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    with open("models.yml", 'r') as ymlfile:
      configs = yaml.load(ymlfile)['models']

    if prompt_id in configs:
      model_settings = configs[prompt_id]
    else:
      return make_response(jsonify(message="error: model not found"), 400)

    automl_response = automl_prediction(entry, model_settings['automl'])
    prediction_label = label(automl_response.payload)
    feedback = LABELS[prediction_label]

    log(request=request_json, label=prediction_label, feedback=feedback)

    return make_response(jsonify(message=feedback,correct=True), 200)

def param_for(key, request, request_json):
  if request.args and key in request.args:
      return request.args.get(key)
  elif request_json and key in request_json:
      return request_json[key]
  else:
      return None

def automl_prediction(entry, settings):
    prediction_client = automl.PredictionServiceClient()

    model_url = 'projects/{}/locations/{}/models/{}'.format(settings['project_id'], settings['compute_region'], settings['model_id'])
    payload = {'text_snippet': {'content': entry, 'mime_type': 'text/plain' }}

    return prediction_client.predict(model_url, payload, {})

def label(payload):
    return sorted(payload, key=scoreSort, reverse=True)[0].display_name

def scoreSort(e):
    return e.classification.score

def log(**items):
    print(items)
