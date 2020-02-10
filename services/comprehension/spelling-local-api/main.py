import pkg_resources
from symspellpy import SymSpell
from flask import jsonify
from flask import make_response
import string

FEEDBACK_TYPE = 'spelling'
POS_FEEDBACK = 'Correct spelling!'
NEG_FEEDBACK = 'Try again. There may be a spelling mistake.'
SYM_SPELL = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
DICTIONARY_PATH = pkg_resources.resource_filename(
                           "symspellpy",
                           "frequency_dictionary_en_82_765.txt"
                  )
BIGRAM_PATH = pkg_resources.resource_filename(
                            "symspellpy",
                            "frequency_bigramdictionary_en_243_342.txt"
              )
DICTIONARY = SYM_SPELL.load_dictionary(DICTIONARY_PATH,
                                       term_index=0,
                                       count_index=1)
BIGRAM_DICTIONARY = SYM_SPELL.load_bigram_dictionary(BIGRAM_PATH,
                                                     term_index=0,
                                                     count_index=2)


def response_endpoint(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry is None or prompt_id is None:
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
    entry = entry.translate(str.maketrans("", "", string.punctuation))
    lookup = SYM_SPELL.lookup_compound(entry,
                                       max_edit_distance=2,
                                       transfer_casing=True)
    corrected_entry = lookup[0].term
    wrong_words = list(set(entry.split()) - set(corrected_entry.split()))

    return wrong_words


def get_highlight_list(misspellings):
    return list(map(lambda entry: {
        'type': 'response',
        'id': None,
        'text': entry,
    }, misspellings))
