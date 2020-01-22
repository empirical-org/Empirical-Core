from flask import jsonify, make_response
from grammarcheck import GrammarChecker


GRAMMAR_MODEL_PATH = "model/grammar/"
checker = GrammarChecker(GRAMMAR_MODEL_PATH)

FEEDBACK_TYPE = 'grammar'
POS_FEEDBACK = 'Correct grammar!'
NEG_FEEDBACK = 'Try again. There may be a grammar error.'


def check_grammar(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry is None or prompt_id is None:
        return make_response(jsonify(message="error"), 400)

    # errors is a list of tuples (token, token character offset, error type)
    errors = checker.check(entry)

    response_data = {"feedback_type": FEEDBACK_TYPE,
                     "response_uid": "q23123@3sdfASDF",
                     "feedback": NEG_FEEDBACK if errors else POS_FEEDBACK,
                     "optimal": not errors,
                     "highlight": errors}

    return make_response(jsonify(**response_data), 200)


# if __name__ == "__main__":
#     app.run()
