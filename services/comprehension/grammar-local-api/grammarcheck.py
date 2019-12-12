import re
import spacy

from typing import List, Tuple
from collections import namedtuple

from spacy.tokens.doc import Doc
from spacy.tokens.token import Token

Doc.set_extension("grammar_errors", default=[])
Token.set_extension("grammar_errors", default=[])

question_words = set(["how", "when", "why"])

statistical_error_map = {"WOMAN": "Woman versus women",
                         "ITS": "Its versus it's",
                         "THEN": "Than versus then"}

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
            if (doc[i].tag_ == "POS" or doc[i].pos_ == "PART") and (doc[i + 1].pos_ not in ["NOUN", "CCONJ"]):
                doc._.grammar_errors.append("Plural versus possessive nouns")
                doc[i]._.grammar_errors.append("Plural versus possessive nouns")

    def check_question_mark(self, doc):
        #TODO: should also catch "Is he going to dance tonight." with AUX
        if doc[-1].text != "?":
            if doc[0].text.lower() in question_words:
                doc._.grammar_errors.append("Question marks")
            else:
                for token in doc:
                    if token.dep_.startswith("nsubj") and token.i > token.head.i:
                        doc._.grammar_errors.append("Question marks")

    def check_articles(self, doc):
        for token in doc[:-1]:
            if token.pos_ == "DET" and token.text.lower() == "a" \
                    and re.search("^[aeiou]", doc[token.i+1].text.lower()):
                doc._.grammar_errors.append("Articles")
                token._.grammar_errors.append("Articles")
            elif token.pos_ == "DET" and token.text.lower() == "an" \
                    and not re.search("^[aeiou]", doc[token.i+1].text.lower()):
                doc._.grammar_errors.append("Articles")
                token._.grammar_errors.append("Articles")

    def check_this_versus_that(self, doc):
        # It's not straightforward to rewrite this using spaCy's noun chunks
        # as "this table over there" is not a noun chunk, but "this table" is.
        target_words = set(["this", "that", "those", "these"])
        noun_phrase_pos = set(["NOUN", "ADJ", "NUM", "ADP", "ADV"])

        current_noun_phrase = []
        for token in doc:
            if token.text.lower() in target_words and token.pos_ == "DET":
                current_noun_phrase = [token]
            elif token.pos_ in noun_phrase_pos:
                current_noun_phrase.append(token)
                if token.text.lower() == "here" and current_noun_phrase[0].text.lower() == "that":
                    doc._.grammar_errors.append("This versus that")
                    current_noun_phrase[0]._.grammar_errors.append("This versus that")
                elif token.text.lower() == "here" and current_noun_phrase[0].text.lower() == "those":
                    doc._.grammar_errors.append("Those versus these")
                    current_noun_phrase[0]._.grammar_errors.append("Those versus these")
                elif token.text.lower() == "there" and current_noun_phrase[0].text.lower() == "this":
                    doc._.grammar_errors.append("This versus that")
                    current_noun_phrase[0]._.grammar_errors.append("This versus that")
                elif token.text.lower() == "there" and current_noun_phrase[0].text.lower() == "these":
                    doc._.grammar_errors.append("Those versus these")
                    current_noun_phrase[0]._.grammar_errors.append("Those versus these")
            else:
                current_noun_phrase = []

    def check_spacing(self, doc):
        punctuation_followed_by_space = set([".", "!", "?", ")", ";", ":", ","])
        punctuation_not_preceded_by_space = set([".", "!", "?", ")", ";", ":", ","])
        for token in doc[:-1]:
            if token.text in punctuation_followed_by_space and token.whitespace_ == "":
                doc._.grammar_errors.append("Spacing")
                token._.grammar_errors.append("Spacing")

        for token in doc:
            if token.i > 0 and token.text in punctuation_not_preceded_by_space and len(doc[token.i-1].whitespace_) > 0:
                doc._.grammar_errors.append("Spacing")
                token._.grammar_errors.append("Spacing")
            elif "." in token.text and re.search("\.\w", token.text):
                doc._.grammar_errors.append("Spacing")
                token._.grammar_errors.append("Spacing")

    def check_woman_versus_women(self, doc):
        """
        Flags "womans" as an error.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc:
            if token.text.lower() == "womans":
                doc._.grammar_errors.append("Woman versus women")
                token._.grammar_errors.append("Woman versus women")

    def check_men_versus_man(self, doc):
        """
        Flags "mans" as an error.

        Args:
            doc: a spaCy doc

        Returns:
        """
        for token in doc:
            if token.text.lower() == "mans":
                doc._.grammar_errors.append("Men versus man")
                token._.grammar_errors.append("Men versus man")

    def check_than_versus_then(self, doc):
        for token in doc[1:]:
            if token.text.lower() == "then" and (doc[token.i-1].tag_ == "RBR" or doc[token.i-1].tag_ == "JJR"):
                doc._.grammar_errors.append("Than versus then")
                token._.grammar_errors.append("Than versus then")

    def check_repeated_word(self, doc):
        for token in doc[1:]:
            if token.text.lower() == doc[token.i-1].text.lower():
                doc._.grammar_errors.append("Repeated word")
                token._.grammar_errors.append("Repeated word")

    def _is_subject(self, token):
        if token.dep_.startswith("nsubj"):
            return True
        elif token.dep_ == "conj" and token.head.dep_.startswith("nsubj"):
            return True
        else:
            return False

    def check_subject_pronouns(self, doc):
        obj_pronouns = set(["me", "him", "her", "us", "them"])
        poss_pronouns = set(["my", "your", "her", "his", "its", "our", "their"])
        poss2_pronouns = set(["mine", "yours", "hers", "his", "ours", "theirs"])

        nonsubj_pronouns = obj_pronouns | poss_pronouns | poss2_pronouns
        for token in doc:
            if self._is_subject(token) and token.text.lower() in nonsubj_pronouns:
                doc._.grammar_errors.append("Subject pronouns")
                token._.grammar_errors.append("Subject pronouns")

    def check_object_pronouns(self, doc):
        subj_pronouns = set(["i", "he", "she", "we", "they"])

        for token in doc:
            if token.text.lower() in subj_pronouns and not self._is_subject(token):
                doc._.grammar_errors.append("Object pronouns")
                token._.grammar_errors.append("Object pronouns")

    def check_possessive_nouns(self, doc):
        for token in doc[:-1]:
            if token.tag_ == "NNS" and doc[token.i+1].tag_.startswith("NN"):
                doc._.grammar_errors.append("Possessive nouns")
                token._.grammar_errors.append("Possessive nouns")

    def check_commas_in_numbers(self, doc):
        """
        Mark long numbers (more than 3 digits) as an error.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc:
            if re.search("\d{4,}", token.text):
                doc._.grammar_errors.append("Commas in numbers")
                token._.grammar_errors.append("Commas in numbers")

    def check_commas_after_yes_and_no(self, doc):
        """
        Mark sentences as an error when they contain a yes/no without a following
        comma.

        Args:
            doc: a spaCy doc

        Returns:

        """
        for token in doc[:-1]:
            if token.text.lower() in ["yes", "no"] and not doc[token.i+1].is_punct:
                doc._.grammar_errors.append("Commas after yes & no")
                token._.grammar_errors.append("Commas after yes & no")

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
                if token.text.lower() in ["a", "an"] and token.dep_ == "det" and token.head.tag_ == "NNS":
                    doc._.grammar_errors.append("Singular and plural nouns")
                    token._.grammar_errors.append("Singular and plural nouns")

    def check_capitalization(self, doc):
        """
        Identify cases where a sentence does not start with a capital letter, or
        "i" is not capitalized.

        Args:
            doc: a spaCy doc

        Returns:

        """
        if re.search("^[a-z]", doc[0].text):
            doc._.grammar_errors.append("Capitalization")
            doc[0]._.grammar_errors.append("Capitalization")

        for token in doc[1:]:
            if token.text == "i":
                doc._.grammar_errors.append("Capitalization")
                token._.grammar_errors.append("Capitalization")

    def check_contractions(self, doc):
        """
        Identify incorrect contractions such as "Im" and "didnt".

        Args:
            doc: a spaCy doc

        Returns:

        """
        incorrect_contractions1 = set(["im", "youre", "hes", "shes", "theyre"])
        incorrect_contractions2 = set(["dont", "didnt", "wont"])
        incorrect_contractions = incorrect_contractions1 | incorrect_contractions2

        incorrect_verbs = set(["m", "re", "s", "nt"])

        for token in doc:
            if token.text.lower() in incorrect_contractions:
                doc._.grammar_errors.append("Contractions")
                token._.grammar_errors.append("Contractions")
            elif token.pos_ in ["VERB", "ADV"] and token.text.lower() in incorrect_verbs:
                doc._.grammar_errors.append("Contractions")
                token._.grammar_errors.append("Contractions")


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


