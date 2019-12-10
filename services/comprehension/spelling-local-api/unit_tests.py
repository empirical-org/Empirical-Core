from mock import Mock, patch
from unittest import TestCase
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask(__name__)

def test_missing_prompt_id(app):
    with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': None}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 400

def test_missing_entry(app):
    with app.test_request_context(json={'entry': None, 'prompt_id': 000}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 400

def test_spelled_correctly_branch(app):
    with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': 000}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data.get('feedback') == 'Correct spelling!'
      assert data.get('feedback_type') == 'spelling'
      assert data.get('optimal') == True
      assert len(data.get('highlight')) == 0

def test_spelled_incorrectly_branch(app):
    with app.test_request_context(json={'entry': 'This is spelllled incorrectly.', 'prompt_id': 000}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data.get('feedback') == 'Try again. There may be a spelling mistake.'
      assert data.get('feedback_type') == 'spelling'
      assert data.get('optimal') == False
      assert data.get('highlight')[0].get('text') == 'spelllled'


def test_correct_spelling():
    misspelled = main.get_misspelled_words_no_casing('This is spelled correctly.')
    assert len(misspelled) == 0

def test_incorrect_spelling_single_error_middle_of_sentence():
    misspelled = main.get_misspelled_words_no_casing('This is spellllled correctly.')
    assert len(misspelled) == 1
    assert 'spellllled' in misspelled

def test_incorrect_spelling_single_error_end_of_sentence():
    misspelled = main.get_misspelled_words_no_casing('This is spelled incorrectlee.')
    assert len(misspelled) == 1
    assert 'incorrectlee' in misspelled

def test_incorrect_spelling_single_error_beginning_of_sentence():
    misspelled = main.get_misspelled_words_no_casing('Thissss is spelled incorrectly.')
    assert len(misspelled) == 1
    assert 'thissss' in misspelled

def test_incorrect_spelling_multiple_errors():
    misspelled = main.get_misspelled_words_no_casing('Thissss is spellllled incorrectlee.')
    assert len(misspelled) == 3
    assert 'thissss' in misspelled
    assert 'spellllled' in misspelled
    assert 'incorrectlee' in misspelled

def test_casing():
    flagged = ['thissss', 'spEled']
    entry = 'Thissss is spEled incorrectly.'
    highlight = main.get_misspelled_highlight_list_with_casing(flagged, entry)
    assert len(highlight) == 2
    assert highlight[0]['text'] == 'Thissss'
    assert highlight[1]['text'] == 'spEled'
    
