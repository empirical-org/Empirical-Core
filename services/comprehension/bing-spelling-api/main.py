from spellchecker import SpellChecker
from flask import jsonify
from flask import make_response
import string
import re
import requests

def response_endpoint(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    response = get_bing_api_response(entry)
    if response.get('error'):
        return make_response(jsonify(message=response.get('error').get('message')), 400)

    misspelled_flagged = response.get('flaggedTokens')
    if not misspelled_flagged:
        return make_response(jsonify(feedback="Correct spelling!", feedback_type="spelling", optimal=True, response_uid="q23123@3sdfASDF", highlight=[]), 200)
    else:
        return make_response(jsonify(feedback="Try again. There may be a spelling mistake.", feedback_type="spelling", optimal=False, response_uid="q23123@3sdfASDF", highlight=get_misspelled_highlight_list(misspelled_flagged)), 200)  
        

def get_bing_api_response(entry):
    headers = {"Ocp-Apim-Subscription-Key":"38ce5e3bba1e46b4b211bfa00f31563c"}
    params = {"text": entry, "mode":"proof"}
    response = requests.get(
      "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck", 
      params=params, 
      headers=headers)
    json_response = response.json()
    return json_response

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
