import pkg_resources
from symspellpy import SymSpell, Verbosity
from flask import jsonify
from flask import make_response
import string

FEEDBACK_TYPE = 'spelling'
POS_FEEDBACK = 'Correct spelling!'
NEG_FEEDBACK = 'Try again. There may be a spelling mistake.'

def response_endpoint(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    try:
        misspellings = get_misspellings(entry)
    except AssertionError as error:
        return make_response(jsonify(message=error), 500)

    response_data = {
        'feedback_type': FEEDBACK_TYPE,
        'response_uid': 'q23123@3sdfASDF',
        'feedback': misspellings and NEG_FEEDBACK or POS_FEEDBACK,
        'optimal': not misspellings,
        'highlight': misspellings and get_highlight_list(misspellings) or [],
    }

    return make_response(jsonify(**response_data), 200)

def get_misspellings(entry):
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
    dictionary_path = pkg_resources.resource_filename("symspellpy", "frequency_dictionary_en_82_765.txt")
    bigram_path = pkg_resources.resource_filename("symspellpy", "frequency_bigramdictionary_en_243_342.txt")

    assert (sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)), "Could not load dictionary resource."
    assert (sym_spell.load_bigram_dictionary(bigram_path, term_index=0, count_index=2)), "Could not load bigram resource."

    entry = entry.strip(string.punctuation)
    corrected_entry = sym_spell.lookup_compound(entry, max_edit_distance=2, transfer_casing=True)[0].term
    wrong_words = list(set(entry.split()) - set(corrected_entry.split()))

    return wrong_words

def get_highlight_list(misspellings):
    return list(map(lambda entry: {
        'type': 'response',
        'id': None,
        'text': entry,
    }, misspellings))
