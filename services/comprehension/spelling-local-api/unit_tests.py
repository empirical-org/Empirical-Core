from mock import Mock, patch
from unittest import TestCase
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="class")
def app():
    return flask.Flask(__name__)

class TestParameterChecks:

    def test_missing_prompt_id(self, app):
        with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': None}):
          response = main.response_endpoint(flask.request)
          data = json.loads(response.data)

          assert response.status_code == 400

    def test_missing_entry(self, app):
        with app.test_request_context(json={'entry': None, 'prompt_id': 000}):
          response = main.response_endpoint(flask.request)
          data = json.loads(response.data)

          assert response.status_code == 400

class TestBranches:

    def test_spelled_correctly_branch(self, app):
        with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': 000}):
          response = main.response_endpoint(flask.request)
          data = json.loads(response.data)

          assert response.status_code == 200
          assert data.get('feedback') == 'Correct spelling!'
          assert data.get('feedback_type') == 'spelling'
          assert data.get('optimal') == True
          assert len(data.get('highlight')) == 0

    def test_spelled_incorrectly_branch(self, app):
        with app.test_request_context(json={'entry': 'This is spelllled incorrectly.', 'prompt_id': 000}):
          response = main.response_endpoint(flask.request)
          data = json.loads(response.data)

          assert response.status_code == 200
          assert data.get('feedback') == 'Try again. There may be a spelling mistake.'
          assert data.get('feedback_type') == 'spelling'
          assert data.get('optimal') == False
          assert data.get('highlight')[0].get('text') == 'spelllled'

class TestApiSpellCheck:

    def test_correct_spelling(self):
        misspelled = main.get_misspellings('This is spelled correctly.')
        assert len(misspelled) == 0

    def test_incorrect_spelling_single_error_middle_of_sentence(self):
        misspelled = main.get_misspellings('This is spellllled correctly.')
        assert len(misspelled) == 1
        assert 'spellllled' in misspelled

    def test_incorrect_spelling_single_error_end_of_sentence(self):
        misspelled = main.get_misspellings('This is spelled incorrectlee.')
        assert len(misspelled) == 1
        assert 'incorrectlee' in misspelled

    def test_incorrect_spelling_single_error_beginning_of_sentence(self):
        misspelled = main.get_misspellings('Thissss is spelled incorrectly.')
        assert len(misspelled) == 1
        assert 'Thissss' in misspelled

    def test_incorrect_spelling_multiple_errors(self):
        misspelled = main.get_misspellings('Thissss is spellllled incorrectlee.')
        assert len(misspelled) == 3
        assert 'Thissss' in misspelled
        assert 'spellllled' in misspelled
        assert 'incorrectlee' in misspelled
