import flask
import pytest
import main
import grammarcheck
from constants import GrammarError
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask("main")


def test_missing_prompt_id(app):
    with app.test_request_context(json={'entry': 'It is spelled correctly.',
                                        'prompt_id': None}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_missing_entry(app):
    with app.test_request_context(json={'entry': None, 'prompt_id': 000}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_grammar_errors(app):

    errors = [("He readed a book.", 3, GrammarError.VERB_TENSE.value),
              ("He writed a book.", 3, GrammarError.VERB_TENSE.value),
              ("He wrote a book.", None, None),
              ("She bringed her father.", 4, GrammarError.VERB_TENSE.value),
              ("She cutted her finger.", 4, GrammarError.VERB_TENSE.value),
              ("She hearded about the concert from my friend.", 4,
               GrammarError.VERB_TENSE.value),
              ("I was listen to music when you called.", 6,
               GrammarError.VERB_TENSE.value),
              ("We had sang a song before eating dinner.", 7,
               GrammarError.VERB_TENSE.value),
              ("I have eated at this resturaunt every week.", 7,
               GrammarError.VERB_TENSE.value),
              ("Have you ate pizza before?", 9,
               GrammarError.VERB_TENSE.value),
              ("Have you eaten pizza before?", None, None),
              ("Have you eaten pizza before.", 27,
               GrammarError.QUESTION_MARK.value),
              ("I have eaten pizza before", 19,
               GrammarError.PUNCTUATION.value),
              ("I have eaten pizza before.", None, None),
              ("Every repository has it's own README.", 21,
               GrammarError.ITS_IT_S.value),
              ("Every repository has its own README.", None, None),
              ("It is is cold outside.", 6, GrammarError.REPEATED_WORD.value),
              ("It is cold outside.", None, None),
              ("Its cold outside.", 0, GrammarError.ITS_IT_S.value),
              ("It's cold outside.", None, None),
              ("He drive a car.", 3,
               GrammarError.SUBJECT_VERB_AGREEMENT.value),
              ("He drives a car.", None, None),
              ("He owns a anteater.", 8, GrammarError.ARTICLE.value),
              ("He owns an anteater.", None, None),
              ("Do you see this anteater over there?", 11,
               GrammarError.THIS_THAT.value),
              ("Do you see that anteater over there?", None, None),
              ("Do you see that anteater over here?", 11,
               GrammarError.THIS_THAT.value),
              ("Do you see this anteater over here?", None, None),
              ("Do you see these koalas over there?", 11,
               GrammarError.THIS_THAT.value),
              ("Do you see those koalas over there?", None, None),
              ("Do you see those koalas over here?", 11,
               GrammarError.THIS_THAT.value),
              ("Do you see these koalas over here?", None, None),
              ("I do .", 5, GrammarError.SPACING.value),
              ("I do.", None, None),
              ("We have several woman on the board.", 16,
               GrammarError.WOMAN_WOMEN.value),
              ("We have several womans on the board.", 16,
               GrammarError.WOMAN_WOMEN.value),
              ("We have several women on the board.", None, None),
              ("We have only one women on the board.", 17,
               GrammarError.WOMAN_WOMEN.value),
              ("We have only one woman on the board.", None, None),
              ("We have too many mans on the board.", 17,
               GrammarError.MAN_MEN.value),
              ("We have too many men on the board.", None, None),
              ("I am taller then you.", 12, GrammarError.THAN_THEN.value),
              ("I am taller than you.", None, None),
              ("If you're taller, than I will run away.", 18,
               GrammarError.THAN_THEN.value),
              ("If you're taller, then I will run away.", None, None),
              ("You and me make a great team.", 8,
               GrammarError.SUBJECT_PRONOUN.value),
              ("You and I make a great team.", None, None),
              ("He helped you and I so many times.", 18,
               GrammarError.OBJECT_PRONOUN.value),
              ("He helped you and me so many times.", None, None),
              ("It's my mothers house.", 8,
               GrammarError.PLURAL_POSSESSIVE.value),
              ("It's my mother's house.", None, None),
              ("This village has 20000 inhabitants.", 17,
               GrammarError.COMMAS_IN_NUMBERS.value),
              ("This village has 20,000 inhabitants.", None, None),
              ("He was born in 1982.", None, None),
              ("Yes it was me.", 0, GrammarError.YES_NO_COMMA.value),
              ("Yes, it was me.", None, None),
              ("She has a cars.", 8, GrammarError.SINGULAR_PLURAL.value),
              ("She has a car.", None, None),
              ("this sentence does not start with a capital letter.", 0,
               GrammarError.CAPITALIZATION.value),
              ("This sentence starts with a capital letter.", None, None),
              ("Youre my best friend.", 3, GrammarError.CONTRACTION.value),
              ("You're my best friend.", None, None),
              ("I have two child.", 11, GrammarError.CHILD_CHILDREN.value),
              ("I have two children.", None, None)]

    for error, index, error_type in errors:
        with app.test_request_context(json={'entry': error,
                                            'prompt_id': 000}):
            response = main.check_grammar(flask.request)
            data = json.loads(response.data)

            print(error)
            print(data)

            if index is not None:
                assert response.status_code == 200
                assert data.get('feedback') == 'Try again. ' \
                                               'There may be a grammar error.'
                assert data.get('feedback_type') == 'grammar'
                assert data.get('optimal') is False
                assert error_type in [h["category"]
                                      for h in data.get('highlight')]
            else:

                assert response.status_code == 200
                assert data.get('feedback') == 'Correct grammar!'
                assert data.get('feedback_type') == 'grammar'
                assert data.get('optimal') is True
                assert len(data.get('highlight')) == 0


def test_grammar_errors_with_prompt(app):

    errors = [("he readed a book.", "He likes to read, so", 24, GrammarError.VERB_TENSE.value),
              ("he likes to read.", "He readed a book, because", None, None),
              ("its a hot day.", "He is wearing a T-shirt, because", 33, GrammarError.ITS_IT_S.value),
              ("a hot day.", "He is wearing a T-shirt, because its", None, None)]

    for error, prompt, index, error_type in errors:
        with app.test_request_context(json={'entry': error,
                                            'prompt_text': prompt,
                                            'prompt_id': 000}):
            response = main.check_grammar(flask.request)
            data = json.loads(response.data)

            print(error)
            print(data)

            if index is not None:
                assert response.status_code == 200
                assert data.get('feedback') == 'Try again. ' \
                                               'There may be a grammar error.'
                assert data.get('feedback_type') == 'grammar'
                assert data.get('optimal') is False
                assert index == data.get('highlight')[0].get('character')
                assert error_type in [h["category"]
                                      for h in data.get('highlight')]
            else:

                assert response.status_code == 200
                assert data.get('feedback') == 'Correct grammar!'
                assert data.get('feedback_type') == 'grammar'
                assert data.get('optimal') is True
                assert len(data.get('highlight')) == 0