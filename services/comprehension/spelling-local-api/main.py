from spellchecker import SpellChecker
from flask import jsonify
from flask import make_response
import string
import re

def response_endpoint(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)
    
    spell = SpellChecker()
    entry = entry.strip(string.punctuation)
    misspelled_flagged = spell.unknown(entry.split())
    
    if not misspelled_flagged:
        return make_response(jsonify(feedback="Correct spelling!", feedback_type="spelling", optimal=True, response_uid="q23123@3sdfASDF", highlight=[]), 200)
    else:
        highlight = []
        misspelled_original = re.findall(r"(?=("+'|'.join(misspelled_flagged)+r"))", entry, re.IGNORECASE)
        for word in misspelled_original:
            wordObj = {"type": "response","id": None,"text": word}
            highlight.append(wordObj)
        return make_response(jsonify(feedback="Try again. There may be a spelling mistake.", feedback_type="spelling", optimal=False, response_uid="q23123@3sdfASDF", highlight=highlight), 200)  
    
def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    else:
        return (request_json or {}).get(key)
