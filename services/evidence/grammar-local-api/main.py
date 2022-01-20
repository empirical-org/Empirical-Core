from flask import jsonify, make_response
from grammarcheck import Error, GrammarChecker


GRAMMAR_MODEL_PATH = "model/grammar/"
checker = GrammarChecker(GRAMMAR_MODEL_PATH)

FEEDBACK_TYPE = 'grammar'
POS_FEEDBACK = 'Correct grammar!'
NEG_FEEDBACK = 'Try again. There may be a grammar error.'


def check_grammar(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_text = request_json.get('prompt_text', '')
    prompt_id = request_json.get('prompt_id')

    if entry is None or prompt_id is None:
        return make_response(jsonify(message="error"), 400)

    errors = check_for_errors(entry, prompt_text)

    # convert errors to hashes fitting the API protocol for highlights
    highlights = list(map(lambda e: highlight_hash(e), errors))

    response_data = {"feedback_type": FEEDBACK_TYPE,
                     "response_uid": "q23123@3sdfASDF",
                     "feedback": NEG_FEEDBACK if errors else POS_FEEDBACK,
                     "optimal": not errors,
                     "highlight": highlights}

    return make_response(jsonify(**response_data), 200)


def check_for_errors(entry, prompt_text=''):
    full_sentence = f'{prompt_text} {entry}'.strip()
    # errors is a list of tuples (token, token character offset, error type)
    errors = checker.check(full_sentence)

    # If the error is in the stem, we don't care about it
    entry_errors = list(filter(lambda e: (e.index > len(prompt_text) or
                                          len(prompt_text) == 0),
                               errors))

    # Now we need to modify the highlight index by the length of the prompt
    # text + 1 because we add a space
    offset_adjusted_errors = [Error(text=e.text,
                                    index=e.index - len(prompt_text) - 1,
                                    type=e.type) for e in entry_errors]

    return offset_adjusted_errors


def highlight_hash(error):

    return {
        'type': 'response',
        'id': None,
        'text': error.text,
        'category': error.type,
        'character': error.index
    }
# if __name__ == "__main__":
#     app.run()
