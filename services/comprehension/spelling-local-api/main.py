import pkg_resources
from symspellpy import SymSpell, Verbosity
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

    misspelled_flagged = get_misspelled_words_no_casing(entry)

    if not misspelled_flagged:
        return make_response(jsonify(feedback="Correct spelling!", feedback_type="spelling", optimal=True, response_uid="q23123@3sdfASDF", highlight=[]), 200)
    else:
        return make_response(jsonify(feedback="Try again. There may be a spelling mistake.", feedback_type="spelling", optimal=False, response_uid="q23123@3sdfASDF", highlight=get_misspelled_highlight_list_with_casing(misspelled_flagged, entry)), 200)

def get_misspelled_words_no_casing(entry):
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
    dictionary_path = pkg_resources.resource_filename("symspellpy", "frequency_dictionary_en_82_765.txt")
    bigram_path = pkg_resources.resource_filename("symspellpy", "frequency_bigramdictionary_en_243_342.txt")

    if not sym_spell.load_dictionary(dictionary_path, term_index=0,
                                     count_index=1):
        print("Dictionary file not found")
        return
    if not sym_spell.load_bigram_dictionary(bigram_path, term_index=0,
                                            count_index=2):
        print("Bigram dictionary file not found")
        return

    entry = entry.strip(string.punctuation)
    corrected_entry = sym_spell.lookup_compound(entry, max_edit_distance=2, transfer_casing=True)[0].term
    wrong_words = list(set(entry.split()) - set(corrected_entry.split()))

    return wrong_words

def get_misspelled_highlight_list_with_casing(flagged, entry):
    highlight = []
    # misspelled_original = re.findall(r"(?=("+'|'.join(flagged)+r"))", entry, re.IGNORECASE)
    for word in flagged:
        wordObj = {"type": "response","id": None,"text": word}
        highlight.append(wordObj)
    return highlight

def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    else:
        return (request_json or {}).get(key)
