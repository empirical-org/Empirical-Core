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

def mock_response_for(label_dict):
    mock_response = Mock()
    payload = []

    for label, score in label_dict.items():
      mock = Mock(display_name=label, classification=Mock(score=score))
      payload.append(mock)

    mock_response.payload = payload

    return mock_response

def test_correct_spelling(app):
    with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': 35}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data['optimal'] == True
      assert data['feedback'] == "Correct spelling!"
      assert data['highlight'] == []

def test_incorrect_spelling_single_error_middle_of_sentence(app):
    with app.test_request_context(json={'entry': 'This is spelllled incorrectly.', 'prompt_id': 35}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data['optimal'] == False
      assert data['feedback'] == "Try again. There may be a spelling mistake."
      assert data['highlight'][0]['text'] == 'spelllled'

def test_incorrect_spelling_single_error_end_of_sentence(app):
    with app.test_request_context(json={'entry': 'This is spelled incorrectlee.', 'prompt_id': 35}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data['optimal'] == False
      assert data['feedback'] == "Try again. There may be a spelling mistake."
      assert data['highlight'][0]['text'] == 'incorrectlee'

def test_incorrect_spelling_single_error_beginning_of_sentence(app):
    with app.test_request_context(json={'entry': 'Thisss is spelled incorrectly.', 'prompt_id': 35}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data['optimal'] == False
      assert data['feedback'] == "Try again. There may be a spelling mistake."
      assert data['highlight'][0]['text'] == 'Thisss'

def test_incorrect_spelling_multiple_errors(app):
    with app.test_request_context(json={'entry': 'Thisss is spelleeed incorrectlee.', 'prompt_id': 35}):
      response = main.response_endpoint(flask.request)
      data = json.loads(response.data)

      assert response.status_code == 200
      assert data['optimal'] == False
      assert data['feedback'] == "Try again. There may be a spelling mistake."
      assert data['highlight'][0]['text'] == 'Thisss'
      assert data['highlight'][1]['text'] == 'spelleeed'
      assert data['highlight'][2]['text'] == 'incorrectlee'