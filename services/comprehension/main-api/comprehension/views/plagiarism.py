import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from difflib import SequenceMatcher

from . import ApiView
from ..models.prompt import Prompt
from ..utils import construct_feedback_payload


INCORRECT_FEEDBACK = ('Revise your work. Although your response '
                      'should be based on the text, it should '
                      'be written in your own words.')
CORRECT_FEEDBACK = 'All plagiarism checks passed.'
FEEDBACK_TYPE = 'plagiarism'
FEEDBACK_ID = ''


class PlagiarismFeedbackView(ApiView):
    def post(self, request):
        submission = json.loads(request.body)

        entry = submission['entry']
        prompt_id = submission['prompt_id']
        prompt = get_object_or_404(Prompt, pk=prompt_id)
        activity = prompt.activityprompt_set.first().activity
        passage = activity.activitypassage_set.first().passage

        if self._check_is_plagiarism(entry, passage.text):
            feedback = INCORRECT_FEEDBACK
            optimal = False
        else:
            feedback = CORRECT_FEEDBACK
            optimal = True

        response = construct_feedback_payload(feedback,
                                              FEEDBACK_TYPE,
                                              optimal,
                                              FEEDBACK_ID)

        return JsonResponse(response)

    def _check_is_plagiarism(self, entry, passage):
        punctuation = ",.;|!?:\'\"-()[]/"
        remove_punctuation = str.maketrans(punctuation, ' ' * len(punctuation))

        entry_words = (entry.translate(remove_punctuation)
                       .lower().split())

        passage_words = (passage.translate(remove_punctuation)
                         .lower().split())

        match = ((SequenceMatcher(lambda x: x in "\t\n", passage_words,
                  entry_words).find_longest_match(0, len(passage_words),
                  0, len(entry_words))))

        return match.size >= 5
