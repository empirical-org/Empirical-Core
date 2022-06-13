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
    with app.test_request_context(json={'entry': 'It is spelled correctly.',
                                        'prompt_id': None}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_missing_entry(app):
    with app.test_request_context(json={'entry': None, 'prompt_id': 000}):
        response = main.check_grammar(flask.request)

        assert response.status_code == 400


def test_grammar_errors(app):

    errors = [("He readed a book.", 3, grammarcheck.VERB_TENSE_ERROR),
              ("He writed a book.", 3, grammarcheck.VERB_TENSE_ERROR),
              ("He wrote a book.", None, None),
              ("She bringed her father.", 4, grammarcheck.VERB_TENSE_ERROR),
              ("She cutted her finger.", 4, grammarcheck.VERB_TENSE_ERROR),
              ("She hearded about the concert from my friend.", 4,
               grammarcheck.VERB_TENSE_ERROR),
              ("I was listen to music when you called.", 6,
               grammarcheck.VERB_TENSE_ERROR),
              ("We had sang a song before eating dinner.", 7,
               grammarcheck.VERB_TENSE_ERROR),
              ("I have eated at this resturaunt every week.", 7,
               grammarcheck.VERB_TENSE_ERROR),
              ("Have you ate pizza before?", 9,
               grammarcheck.VERB_TENSE_ERROR),
              ("Have you eaten pizza before?", None, None),
              ("Have you eaten pizza before.", 27,
               grammarcheck.QUESTION_MARK_ERROR),
              ("I have eaten pizza before", 19,
               grammarcheck.PUNCTUATION_ERROR),
              ("I have eaten pizza before.", None, None),
              ("Every repository has it's own README.", 21,
               grammarcheck.ITS_IT_S_ERROR),
              ("Every repository has its own README.", None, None),
              ("It is is cold outside.", 6, grammarcheck.REPEATED_WORD_ERROR),
              ("It is cold outside.", None, None),
              ("Its cold outside.", 0, grammarcheck.ITS_IT_S_ERROR),
              ("It's cold outside.", None, None),
              ("He drive a car.", 3,
               grammarcheck.SUBJECT_VERB_AGREEMENT_ERROR),
              ("He drives a car.", None, None),
              ("He owns a anteater.", 8, grammarcheck.ARTICLE_ERROR),
              ("He owns an anteater.", None, None),
              ("Do you see this anteater over there?", 11,
               grammarcheck.THIS_THAT_ERROR),
              ("Do you see that anteater over there?", None, None),
              ("Do you see that anteater over here?", 11,
               grammarcheck.THIS_THAT_ERROR),
              ("Do you see this anteater over here?", None, None),
              ("Do you see these koalas over there?", 11,
               grammarcheck.THIS_THAT_ERROR),
              ("Do you see those koalas over there?", None, None),
              ("Do you see those koalas over here?", 11,
               grammarcheck.THIS_THAT_ERROR),
              ("Do you see these koalas over here?", None, None),
              ("I do .", 5, grammarcheck.SPACING_ERROR),
              ("I do.", None, None),
              ("We have several woman on the board.", 16,
               grammarcheck.WOMAN_WOMEN_ERROR),
              ("We have several womans on the board.", 16,
               grammarcheck.WOMAN_WOMEN_ERROR),
              ("We have several women on the board.", None, None),
              ("We have only one women on the board.", 17,
               grammarcheck.WOMAN_WOMEN_ERROR),
              ("We have only one woman on the board.", None, None),
              ("We have too many mans on the board.", 17,
               grammarcheck.MAN_MEN_ERROR),
              ("We have too many men on the board.", None, None),
              ("I am taller then you.", 12, grammarcheck.THAN_THEN_ERROR),
              ("I am taller than you.", None, None),
              ("If you're taller, than I will run away.", 18,
               grammarcheck.THAN_THEN_ERROR),
              ("If you're taller, then I will run away.", None, None),
              ("You and me make a great team.", 8,
               grammarcheck.SUBJECT_PRONOUN_ERROR),
              ("You and I make a great team.", None, None),
              ("He helped you and I so many times.", 18,
               grammarcheck.OBJECT_PRONOUN_ERROR),
              ("He helped you and me so many times.", None, None),
              ("It's my mothers house.", 8,
               grammarcheck.PLURAL_POSSESSIVE_ERROR),
              ("It's my mother's house.", None, None),
              ("This village has 20000 inhabitants.", 17,
               grammarcheck.COMMAS_IN_NUMBERS_ERROR),
              ("This village has 20,000 inhabitants.", None, None),
              ("He was born in 1982.", None, None),
              ("Yes it was me.", 0, grammarcheck.YES_NO_COMMA_ERROR),
              ("Yes, it was me.", None, None),
              ("She has a cars.", 8, grammarcheck.SINGULAR_PLURAL_ERROR),
              ("She has a car.", None, None),
              ("this sentence does not start with a capital letter.", 0,
               grammarcheck.CAPITALIZATION_ERROR),
              ("This sentence starts with a capital letter.", None, None),
              ("Youre my best friend.", 3, grammarcheck.CONTRACTION_ERROR),
              ("You're my best friend.", None, None),
              ("I have two child.", 11, grammarcheck.CHILD_CHILDREN_ERROR),
              ("I have two children.", None, None)]

    for error, index, error_type in errors:
        with app.test_request_context(json={'entry': error,
                                            'prompt_id': 000}):
            response = main.check_grammar(flask.request)
            data = json.loads(response.data)

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


def test_error_filtering(app):
    errors_in_prompt_only = main.check_for_errors(entry='a book.',
                                                  prompt_text='He readed')
    assert len(errors_in_prompt_only) == 0

    errors_in_entry_only = main.check_for_errors(entry='readed a book.',
                                                 prompt_text='He')
    assert len(errors_in_entry_only) == 1
    assert errors_in_entry_only[0].index == 0

    errors_in_both = main.check_for_errors(entry='and writed a book.',
                                           prompt_text='He readed')
    assert len(errors_in_both) == 1
    assert errors_in_both[0].index == 4
