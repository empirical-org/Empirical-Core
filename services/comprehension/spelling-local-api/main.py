import pkg_resources
from symspellpy import SymSpell, Verbosity
from flask import jsonify
from flask import make_response
import string


def response_endpoint(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    try:
        misspelled_flagged = get_misspelled_words(entry)
    except AssertionError as error:
        return make_response(jsonify(message=error), 500)

    response_data = {
        'feedback_type': 'spelling',
        'response_uid': 'q23123@3sdfASDF',
        'feedback': 'Correct spelling!',
        'optimal': True,
        'highlight': [],
    }

    if misspelled_flagged:
        response_data.update({
            'feedback': 'Try again. There may be a spelling mistake.',
            'optimal': False,
            'highlight': get_misspelled_highlight_list(misspelled_flagged),
        })

    return make_response(jsonify(**response_data), 200)

def get_misspelled_words(entry):
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
    dictionary_path = pkg_resources.resource_filename("symspellpy", "frequency_dictionary_en_82_765.txt")
    bigram_path = pkg_resources.resource_filename("symspellpy", "frequency_bigramdictionary_en_243_342.txt")

    assert (sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)), "Could not load dictionary resource."
    assert (sym_spell.load_bigram_dictionary(bigram_path, term_index=0, count_index=2)), "Could not load bigram resource."

    entry = entry.strip(string.punctuation)
    corrected_entry = sym_spell.lookup_compound(entry, max_edit_distance=2, transfer_casing=True)[0].term
    wrong_words = list(set(entry.split()) - set(corrected_entry.split()))

    return wrong_words

def get_misspelled_highlight_list(misspelled_flagged):
    return list(map(lambda entry: {
        'type': 'response',
        'id': None,
        'text': entry,
    }, misspelled_flagged))
