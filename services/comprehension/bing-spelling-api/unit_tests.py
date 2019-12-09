from mock import Mock, patch
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope='class')
def app():
    return flask.Flask(__name__)

def mock_response_for(misspelled):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    mock_response_data = {'flaggedTokens': map(lambda entry: {'token': entry}, misspelled)}
    return MockResponse(mock_response_data, 200)

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

class TestRequestProcessing:  

    @patch('requests.get')
    def test_spelled_correctly_branch(self, mock_get, app):
        with app.test_request_context(json={'entry': 'This is spelled correctly.', 'prompt_id': 000}):
            mock_get.return_value = mock_response_for([])
            
            response = main.response_endpoint(flask.request)
            data = json.loads(response.data)

            assert response.status_code == 200
            assert data.get('feedback') == 'Correct spelling!'
            assert data.get('feedback_type') == 'spelling'
            assert data.get('optimal') == True
            assert len(data.get('highlight')) == 0  

    @patch('requests.get')
    def test_spelled_incorrectly_branch(self, mock_get, app):
        with app.test_request_context(json={'entry': 'This is spelllled incorrectly.', 'prompt_id': 000}):
            mock_get.return_value = mock_response_for(['spelllled'])
            
            response = main.response_endpoint(flask.request)
            data = json.loads(response.data)

            assert response.status_code == 200
            assert data.get('feedback') == 'Try again. There may be a spelling mistake.'
            assert data.get('feedback_type') == 'spelling'
            assert data.get('optimal') == False
            assert data.get('highlight')[0].get('text') == 'spelllled'

class TestBingSpellingApi(object):
      
    @patch('requests.get')
    def test_correct_spelling(self, mock_get):
        mock_get.return_value = mock_response_for([]) 

        response = main.get_bing_api_response('This is spelled correctly.')
        misspelled = response.get('flaggedTokens')
        assert len(misspelled) == 0

    @patch('requests.get')
    def test_incorrect_spelling_single_error_middle_of_sentence(self, mock_get):
        mock_get.return_value = mock_response_for(['spellllled']) 

        response = main.get_bing_api_response('This is spellllled incorrectly.')
        misspelled = response.get('flaggedTokens')
        assert len(misspelled) == 1
        assert 'spellllled' in misspelled[0].get('token')

    @patch('requests.get')
    def test_incorrect_spelling_single_error_end_of_sentence(self, mock_get):
        mock_get.return_value = mock_response_for(['incorrectlee']) 

        response = main.get_bing_api_response('This is spelled incorrectlee.')
        misspelled = response.get('flaggedTokens')
        assert len(misspelled) == 1
        assert 'incorrectlee' in misspelled[0].get('token')

    @patch('requests.get')
    def test_incorrect_spelling_multiple_errors(self, mock_get):
        mock_get.return_value = mock_response_for(['Thissss','spellllled','incorrectlee']) 

        response = main.get_bing_api_response('Thissss is spellllled incorrectlee.')
        misspelled = response.get('flaggedTokens')
        assert len(misspelled) == 3
        assert 'Thissss' in misspelled[0].get('token')
        assert 'spellllled' in misspelled[1].get('token')
        assert 'incorrectlee' in misspelled[2].get('token')
