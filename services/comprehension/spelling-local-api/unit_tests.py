from unittest import TestCase
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="class")
def app():
    return flask.Flask(__name__)


class TestDictionariesLoading(TestCase):

    def test_dictionary_file(self):
        self.assertIsNotNone(main.DICTIONARY)

    def test_bigram_file(self):
        self.assertIsNotNone(main.BIGRAM_DICTIONARY)


class TestParameterChecks(TestCase):

    def test_missing_prompt_id(self, app):
        context_json = {
            'entry': 'This is spelled correctly.',
            'prompt_id': None
        }
        with app.test_request_context(json=context_json):
            response = main.response_endpoint(flask.request)

            assert response.status_code == 400

    def test_missing_entry(self, app):
        context_json = {
            'entry': None,
            'prompt_id': 000
        }
        with app.test_request_context(json=context_json):
            response = main.response_endpoint(flask.request)

            assert response.status_code == 400


class TestBranches(TestCase):

    def test_spelled_correctly_branch(self, app):
        context_json = {
            'entry': 'This is spelled correctly.',
            'prompt_id': 000
        }
        with app.test_request_context(json=context_json):
            response = main.response_endpoint(flask.request)
            data = json.loads(response.data)

            assert response.status_code == 200
            assert data.get('feedback') == 'Correct spelling!'
            assert data.get('feedback_type') == 'spelling'
            assert data.get('optimal') is True
            assert len(data.get('highlight')) == 0

    def test_spelled_incorrectly_branch(self, app):
        context_json = {
            'entry': 'This is spelllled incorrectly.',
            'prompt_id': 000
        }
        with app.test_request_context(json=context_json):
            response = main.response_endpoint(flask.request)
            data = json.loads(response.data)

            assert response.status_code == 200
            feedback = 'Try again. There may be a spelling mistake.'
            assert data.get('feedback') == feedback
            assert data.get('feedback_type') == 'spelling'
            assert data.get('optimal') is False
            assert data.get('highlight')[0].get('text') == 'spelllled'


class TestApiSpellCheck(TestCase):

    prompt_id = 106

    def test_correct_spelling(self):
        misspelled = main.get_misspellings(self.prompt_id,
                                           'This is spelled correctly.')
        assert len(misspelled) == 0

    def test_incorrect_spelling_single_error_middle_of_sentence(self):
        misspelled = main.get_misspellings(self.prompt_id,
                                           'This is spellllled correctly.')
        assert len(misspelled) == 1
        assert 'spellllled' in misspelled

    def test_incorrect_spelling_single_error_end_of_sentence(self):
        misspelled = main.get_misspellings(self.prompt_id,
                                           'This is spelled incorrectlee.')
        assert len(misspelled) == 1
        assert 'incorrectlee' in misspelled

    def test_incorrect_spelling_single_error_beginning_of_sentence(self):
        misspelled = main.get_misspellings(
                            self.prompt_id,
                            'Thissss is spelled incorrectly.')
        assert len(misspelled) == 1
        assert 'Thissss' in misspelled

    def test_incorrect_spelling_multiple_errors(self):
        test_phrase = 'Thissss is spellllled incorrectlee.'
        misspelled = main.get_misspellings(self.prompt_id, test_phrase)
        assert len(misspelled) == 3
        assert 'Thissss' in misspelled
        assert 'spellllled' in misspelled
        assert 'incorrectlee' in misspelled

    def test_ignore_words(self):
        test_phrase = 'Title IX is correctly spelled.'
        misspelled = main.get_misspellings(self.prompt_id, test_phrase)
        assert len(misspelled) == 0

    def test_apostrophe(self):
        test_phrase = "they're the one i shouldn't want."
        misspelled = main.get_misspellings(self.prompt_id, test_phrase)
        assert len(misspelled) == 0
