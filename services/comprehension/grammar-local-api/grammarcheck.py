import re
import spacy

from typing import List, Tuple
from collections import namedtuple

from spacy.tokens.doc import Doc
from spacy.tokens.token import Token

# Tag, part-of-speech and dependency constants

POSSESSIVE_TAG = "POS"
PARTICIPLE_POS = "PART"
DETERMINER_POS = "DET"
VERB_POS = "VERB"
ADVERB_POS = "ADV"
NOUN_POS = "NOUN"
PLURAL_NOUN_TAG = "NNP"
COORD_CONJ_POS = "CCONJ"
SUBJECT_DEP = "nsubj"
CONJUNCTION_DEP = "conj"
DETERMINER_DEP = "det"
POSSIBLE_POS_IN_NOUN_PHRASE = set(["NOUN", "ADJ", "NUM", "ADP", "ADV"])
COMPARATIVE_TAGS = set(["RBR", "JJR"])

# Token constants

INDEF_ARTICLE_BEFORE_CONSONANT = "a"
INDEF_ARTICLE_BEFORE_VOWEL = "an"
THIS = "this"
THAT = "that"
THOSE = "those"
THESE = "these"
HERE = "here"
THERE = "there"
THEN = "then"
INCORRECT_PLURAL_WOMAN = "womans"
INCORRECT_PLURAL_MAN = "mans"

# Token set constants

PUNCTUATION_FOLLOWED_BY_SPACE = set([".", "!", "?", ")", ";", ":", ","])
PUNCTUATION_NOT_PRECEDED_BY_SPACE = set([".", "!", "?", ")", ";", ":", ","])
INDEF_ARTICLES = set([INDEF_ARTICLE_BEFORE_VOWEL, INDEF_ARTICLE_BEFORE_CONSONANT])
DEMONSTRATIVES = set([THIS, THAT, THOSE, THESE])
SUBJECT_PRONOUNS = set(["i", "he", "she", "we", "they"])
OBJECT_PRONOUNS = set(["me", "him", "her", "us", "them"])
POSSESSIVE_DETERMINERS = set(["my", "your", "her", "his", "its", "our", "their"])
POSSESSIVE_PRONOUNS = set(["mine", "yours", "hers", "his", "ours", "theirs"])
YES_NO = set(["yes", "no"])
INCORRECT_CONTRACTIONS = set(["im", "youre", "hes", "shes", "theyre", "dont", "didnt", "wont"])
CONTRACTED_VERBS_WITHOUT_APOSTROPHE = set(["m", "re", "s", "nt"])
QUESTION_WORDS = set(["how", "when", "why"])

# Error type constants

PLURAL_POSSESSIVE_ERROR = "Plural versus possessive nouns"
QUESTION_MARK_ERROR = "Question marks"
ARTICLE_ERROR = "Articles"
THIS_THAT_ERROR = "This versus that"
THESE_THOSE_ERROR = "These versus those"
SPACING_ERROR = "Spacing"
WOMAN_WOMEN_ERROR = "Woman versus women"
MAN_MEN_ERROR = "Man versus men"
THAN_THEN_ERROR = "Than versus then"
REPEATED_WORD_ERROR = "Repeated word"
SUBJECT_PRONOUN_ERROR = "Subject pronouns"
OBJECT_PRONOUN_ERROR = "Object pronouns"
POSSESSIVE_NOUN_ERROR = "Possessive nouns"
COMMAS_IN_NUMBERS_ERROR = "Commas in numbers"
YES_NO_COMMA_ERROR = "Commas after yes & no"
SINGULAR_PLURAL_ERROR = "Singular and plural nouns"
CAPITALIZATION_ERROR = "Capitalization"
CONTRACTION_ERROR = "Contractions"
ITS_IT_S_ERROR = "Its versus it's"

Token.set_extension("grammar_errors", default=[])

statistical_error_map = {"WOMAN": WOMAN_WOMEN_ERROR,
                         "ITS": ITS_IT_S_ERROR,
                         "THEN": THAN_THEN_ERROR}

Error = namedtuple("Error", ["text", "index", "type"])


class RuleBasedGrammarChecker(object):

    def __call__(self, doc: Doc):
        self.check(doc)
        return doc

    def check(self, doc: Doc):
        self.check_plural_versus_possessive_nouns(doc)
        self.check_this_versus_that(doc)
        self.check_question_mark(doc)
        self.check_spacing(doc)
        self.check_articles(doc)
        self.check_woman_versus_women(doc)
        self.check_than_versus_then(doc)
        self.check_repeated_word(doc)
        self.check_subject_pronouns(doc)
        self.check_object_pronouns(doc)
        self.check_possessive_nouns(doc)
        self.check_commas_in_numbers(doc)
        self.check_commas_after_yes_and_no(doc)
        self.check_men_versus_man(doc)
        self.check_singular_and_plural_nouns(doc)
        self.check_capitalization(doc)
        self.check_contractions(doc)

    def check_plural_versus_possessive_nouns(self, doc):
        # TODO: this does not treat cases like "it's my cousin's" correctly.
        # TODO: Fix problem: infinitival "to" also has pos_ "PART"
        for i in range(0, len(doc) - 1):
            if (doc[i].tag_ == POSSESSIVE_TAG or doc[i].pos_ == PARTICIPLE_POS) and \
                    (doc[i + 1].pos_ not in [NOUN_POS, COORD_CONJ_POS]):
                doc[i]._.grammar_errors.append(PLURAL_POSSESSIVE_ERROR)

    def check_question_mark(self, doc):
        #TODO: should also catch "Is he going to dance tonight." with AUX
        if doc[-1].text != "?":
            if doc[0].text.lower() in QUESTION_WORDS:
                doc[-1]._.grammar_errors.append(QUESTION_MARK_ERROR)
            else:
                for token in doc:
                    if token.dep_.startswith(SUBJECT_DEP) and token.i > token.head.i:
                        doc[-1]._.grammar_errors.append(QUESTION_MARK_ERROR)

    def check_articles(self, doc):
        for token in doc[:-1]:
            if token.pos_ == DETERMINER_POS and token.text.lower() == INDEF_ARTICLE_BEFORE_CONSONANT \
                    and self._starts_with_vowel(doc[token.i+1].text):
                token._.grammar_errors.append(ARTICLE_ERROR)
            elif token.pos_ == DETERMINER_POS and token.text.lower() == INDEF_ARTICLE_BEFORE_VOWEL \
                    and not self._starts_with_vowel(doc[token.i+1].text):
                token._.grammar_errors.append(ARTICLE_ERROR)

    def check_this_versus_that(self, doc):
        # It's not straightforward to rewrite this using spaCy's noun chunks
        # as "this table over there" is not a noun chunk, but "this table" is.

        current_noun_phrase = []
        for token in doc:
            if token.text.lower() in DEMONSTRATIVES and token.pos_ == DETERMINER_POS:
                current_noun_phrase = [token]
            elif token.pos_ in POSSIBLE_POS_IN_NOUN_PHRASE:
                current_noun_phrase.append(token)
                if token.text.lower() == HERE and current_noun_phrase[0].text.lower() == THAT:
                    current_noun_phrase[0]._.grammar_errors.append(THIS_THAT_ERROR)
                elif token.text.lower() == HERE and current_noun_phrase[0].text.lower() == THOSE:
                    current_noun_phrase[0]._.grammar_errors.append(THESE_THOSE_ERROR)
                elif token.text.lower() == THERE and current_noun_phrase[0].text.lower() == THIS:
                    current_noun_phrase[0]._.grammar_errors.append(THIS_THAT_ERROR)
                elif token.text.lower() == THERE and current_noun_phrase[0].text.lower() == THESE:
                    current_noun_phrase[0]._.grammar_errors.append(THESE_THOSE_ERROR)
            else:
                current_noun_phrase = []

    def check_spacing(self, doc):
        for token in doc[:-1]:
            if token.text in PUNCTUATION_FOLLOWED_BY_SPACE and token.whitespace_ == "":
                token._.grammar_errors.append(SPACING_ERROR)

        for token in doc:
            if token.i > 0 and token.text in PUNCTUATION_NOT_PRECEDED_BY_SPACE and len(doc[token.i-1].whitespace_) > 0:
                token._.grammar_errors.append(SPACING_ERROR)
            elif "." in token.text and re.search("\.\w", token.text):
                token._.grammar_errors.append(SPACING_ERROR)

    def check_woman_versus_women(self, doc):
        """
        Flags "womans" as an error.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc:
            if token.text.lower() == INCORRECT_PLURAL_WOMAN:
                token._.grammar_errors.append(WOMAN_WOMEN_ERROR)

    def check_men_versus_man(self, doc):
        """
        Flags "mans" as an error.

        Args:
            doc: a spaCy doc

        Returns:
        """
        for token in doc:
            if token.text.lower() == INCORRECT_PLURAL_MAN:
                token._.grammar_errors.append(MAN_MEN_ERROR)

    def check_than_versus_then(self, doc):
        for token in doc[1:]:
            if token.text.lower() == THEN and doc[token.i-1].tag_ in COMPARATIVE_TAGS:
                token._.grammar_errors.append(THAN_THEN_ERROR)

    def check_repeated_word(self, doc):
        for token in doc[1:]:
            if token.text.lower() == doc[token.i-1].text.lower():
                token._.grammar_errors.append(REPEATED_WORD_ERROR)

    def check_subject_pronouns(self, doc):

        nonsubj_pronouns = OBJECT_PRONOUNS | POSSESSIVE_DETERMINERS | POSSESSIVE_PRONOUNS
        for token in doc:
            if self._is_subject(token) and token.text.lower() in nonsubj_pronouns:
                token._.grammar_errors.append(SUBJECT_PRONOUN_ERROR)

    def check_object_pronouns(self, doc):

        for token in doc:
            if token.text.lower() in SUBJECT_PRONOUNS and not self._is_subject(token):
                token._.grammar_errors.append(OBJECT_PRONOUN_ERROR)

    def check_possessive_nouns(self, doc):
        for token in doc[:-1]:
            if token.tag_ == PLURAL_NOUN_TAG and doc[token.i+1].pos_ == NOUN_POS:
                token._.grammar_errors.append(POSSESSIVE_NOUN_ERROR)

    def check_commas_in_numbers(self, doc):
        """
        Mark long numbers (more than 3 digits) as an error.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc:
            if re.search("\d{4,}", token.text):
                token._.grammar_errors.append(COMMAS_IN_NUMBERS_ERROR)

    def check_commas_after_yes_and_no(self, doc):
        """
        Mark sentences as an error when they contain a yes/no without a following
        comma.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc[:-1]:
            if token.text.lower() in YES_NO and not doc[token.i+1].is_punct:
                token._.grammar_errors.append(YES_NO_COMMA_ERROR)

    def check_singular_and_plural_nouns(self, doc):
        """
        Identify sentences where a singular determiner (a, an) has as its head
        a plural noun.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for noun_chunk in doc.noun_chunks:
            for token in noun_chunk:
                if token.text.lower() in INDEF_ARTICLES and \
                        token.dep_ == DETERMINER_DEP and \
                        token.head.tag_ == PLURAL_NOUN_TAG:
                    token._.grammar_errors.append(SINGULAR_PLURAL_ERROR)

    def check_capitalization(self, doc):
        """
        Identify cases where a sentence does not start with a capital letter, or
        "i" is not capitalized.

        Args:
            doc: a spaCy doc

        Returns:

        """
        if re.match("[a-z]", doc[0].text):
            doc[0]._.grammar_errors.append(CAPITALIZATION_ERROR)

        for token in doc[1:]:
            if token.text == "i":
                token._.grammar_errors.append(CAPITALIZATION_ERROR)

    def check_contractions(self, doc):
        """
        Identify incorrect contractions such as "Im" and "didnt".

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc:
            if token.text.lower() in INCORRECT_CONTRACTIONS:
                token._.grammar_errors.append(CONTRACTION_ERROR)
            elif token.pos_ in [VERB_POS, ADVERB_POS] and token.text.lower() in CONTRACTED_VERBS_WITHOUT_APOSTROPHE:
                token._.grammar_errors.append(CONTRACTION_ERROR)

    # Private utility functions

    def _starts_with_vowel(self, token):
        return re.match("[aeiou]", token, re.IGNORECASE)

    def _is_subject(self, token):
        if token.dep_.startswith(SUBJECT_DEP):
            return True
        elif token.dep_ == CONJUNCTION_DEP and token.head.dep_.startswith(SUBJECT_DEP):
            return True
        else:
            return False


class GrammarChecker:

    def __init__(self, model_path: str):
        self.model = spacy.load(model_path)
        self.model.add_pipe(RuleBasedGrammarChecker())

    def check(self, sentence: str) -> List[Tuple]:
        """
        Check a sentence for grammar errors.

        Args:
            sentence: the sentence that will be checked

        Returns: a list of errors. Every error is a tuple of (token, token character offset, error type)

        """
        errors = []

        doc = self.model(sentence)

        for token in doc:
            if token.ent_type_:
                errors.append(Error(token.text,
                                    token.idx,
                                    statistical_error_map.get(token.ent_type_, token.ent_type_))
                              )

            elif token._.grammar_errors:
                for error in token._.grammar_errors:
                    errors.append(Error(token.text, token.idx, error))

        return errors


