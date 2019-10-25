from google.cloud import automl_v1beta1 as automl
from flask import jsonify
from flask import make_response

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

PROJECT_ID = 'comprehension-247816'
COMPUTE_REGION = 'us-central1'
MODEL_ID = 'TCN136527252061972837'

def label(payload):
    return sorted(payload, key=scoreSort, reverse=True)[0].display_name

def scoreSort(e):
    return e.classification.score

def response_endpoint(request):
    request_json = request.get_json()
    entry = ''
    print(request)
    print(request_json)
    if request.args and 'entry' in request.args:
        entry = request.args.get('entry')
    elif request_json and 'entry' in request_json:
        entry = request_json['entry']
    else:
        return make_response(jsonify(message="error"), 400) 

    prediction_client = automl.PredictionServiceClient()

    model_url = 'projects/{}/locations/{}/models/{}'.format(PROJECT_ID, COMPUTE_REGION, MODEL_ID)
    payload = {'text_snippet': {'content': entry, 'mime_type': 'text/plain' }}

    response = prediction_client.predict(model_url, payload, {})
    prediction_label = label(response.payload)

    return make_response(jsonify(message=LABELS[prediction_label],correct=True), 200) 
