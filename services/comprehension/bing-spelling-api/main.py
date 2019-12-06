from flask import jsonify
from flask import make_response
import string
import requests
import os


def response_endpoint(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    bing_result = get_bing_api_response(entry)
    if bing_result.get('error'):
        return make_response(jsonify(message=bing_result.get('error').get('message')), 400)

    response_data = {
        'feedback_type': 'spelling',
        'response_uid': 'q23123@3sdfASDF',
        'feedback': 'Correct spelling!',
        'optimal': True,
        'highlight': [],
    }

    misspelled_flagged = bing_result.get('flaggedTokens')
    if misspelled_flagged:
        response_data.update({
            'feedback': 'Try again. There may be a spelling mistake.',
            'optimal': False,
            'highlight': get_misspelled_highlight_list(misspelled_flagged),
        })
    
    return make_response(jsonify(**response_data), 200)  
        

def get_bing_api_response(entry):
    headers = {"Ocp-Apim-Subscription-Key": os.getenv('OCP-APIM-SUBSCRIPTION-KEY')}
    params = {"text": entry, "mode": "proof"}
    response = requests.get(
      "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck", 
      params=params, 
      headers=headers)
    return response.json()

def get_misspelled_highlight_list(misspelled_flagged):
    highlight = []
    for entry in misspelled_flagged:
        wordObj = {"type": "response","id": None,"text": entry.get('token')}
        highlight.append(wordObj)
    return highlight

def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    else:
        return (request_json or {}).get(key)
