import flask
import pytest
import main
import grammarcheck
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask("main")


def test_missing_prompt_id(app):
    with app.test_request_context(json={'entry': 'This is spelled correctly.',
                                        'prompt_id': None}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_missing_entry(app):
    with app.test_request_context(json={'entry': None, 'prompt_id': 000}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_correct_grammar(app):
    with app.test_request_context(json={'entry': "It's cold outside.",
                                        'prompt_id': 000}):
        response = main.check_grammar(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data.get('feedback') == 'Correct grammar!'
        assert data.get('feedback_type') == 'grammar'
        assert data.get('optimal') is True
        assert len(data.get('highlight')) == 0


def test_incorrect_grammar(app):
    with app.test_request_context(json={'entry': 'Its cold outside.',
                                        'prompt_id': 000}):
        response = main.check_grammar(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert (data.get('feedback') ==
                'Try again. There may be a grammar error.')
        assert data.get('feedback_type') == 'grammar'
        assert data.get('optimal') is False
        assert data.get('highlight')[0]["text"] == 'Its'
        assert data.get('highlight')[0]["type"] == 'response'
        assert data.get('highlight')[0]["id"] == None
        assert data.get('highlight')[0]["category"] == grammarcheck.ITS_IT_S_ERROR
        assert data.get('highlight')[0]["character"] == 0


def test_incorrect_grammar_repeated_words(app):
    with app.test_request_context(json={'entry': 'It is is cold outside.',
                                        'prompt_id': 000}):
        response = main.check_grammar(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert (data.get('feedback') ==
                'Try again. There may be a grammar error.')
        assert data.get('feedback_type') == 'grammar'
        assert data.get('optimal') is False
        assert data.get('highlight')[0]["text"] == 'is'
        assert data.get('highlight')[0]["type"] == 'response'
        assert data.get('highlight')[0]["id"] == None
        assert data.get('highlight')[0]["category"] == grammarcheck.REPEATED_WORD_ERROR
        assert data.get('highlight')[0]["character"] == 6

