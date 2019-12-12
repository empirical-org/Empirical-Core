from flask import jsonify, make_response
from grammarcheck import GrammarChecker


GRAMMAR_MODEL_PATH = "model/grammar/"
checker = GrammarChecker(GRAMMAR_MODEL_PATH)


def check_grammar(request):
    request_json = request.get_json()

    entry = param_for('entry', request, request_json)
    prompt_id = param_for('prompt_id', request, request_json)

    print("E", entry)
    print("P", prompt_id)

    if entry is None or prompt_id is None:
        return make_response(jsonify(message="error"), 400)

    # errors is a list of tuples (token, token character offset, error type)
    errors = checker.check(entry)

    if not errors:
        return make_response(jsonify(feedback="Correct grammar!",
                                     feedback_type="grammar",
                                     optimal=True,
                                     response_uid="q23123@3sdfASDF",
                                     highlight=[]),
                             200)
    else:
        return make_response(jsonify(feedback="Try again. There may be a grammar error.",
                                     feedback_type="grammar",
                                     optimal=False,
                                     response_uid="q23123@3sdfASDF",
                                     highlight=errors),
                             200)
    

def param_for(key, request, request_json):
    if request.args and key in request.args:
        return request.args.get(key)
    else:
        return (request_json or {}).get(key)


if __name__ == "__main__":
    app.run()
