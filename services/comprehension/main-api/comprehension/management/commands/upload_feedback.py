from csv import DictReader

from django.core.management.base import BaseCommand

from ...models.highlight import Highlight
from ...models.ml_feedback import MLFeedback


class Command(BaseCommand):
    help = 'Parses a CSV for feedback records'

    FEEDBACK_KEY = 'feedback'
    HIGHLIGHT_KEY = 'highlight'

    COMBINED_LABELS_HEADER = 'Combined Labels'
    OPTIMAL_HEADER = 'Optimal'
    FEEDBACK_HEADER = 'Feedback'
    FEEDBACK_ORDER_HEADER = 'Feedback Order'
    HIGHLIGHT_TEXT_HEADER = 'Text to Highlight'
    HIGHLIGHT_SKIP_HEADER = 'Characters to Skip'

    def add_arguments(self, parser):
        parser.add_argument('prompt_id', metavar='PROMPT_ID',
                            help='The database ID of the prompt')
        parser.add_argument('csv_input', metavar='CSV_PATH',
                            help='The path to the input CSV file')

    def handle(self, *args, **kwargs):
        prompt_id = kwargs['prompt_id']
        csv_input = kwargs['csv_input']

        self._drop_existing_feedback_records(prompt_id)

        for result in self._extract_create_feedback_kwargs(csv_input):
            feedback_kwargs = result[self.FEEDBACK_KEY]
            highlight_kwargs = result[self.HIGHLIGHT_KEY]
            feedback_kwargs.update({
                'prompt_id': prompt_id,
            })
            self._create_records(feedback_kwargs, highlight_kwargs)

    def _create_records(self, feedback_kwargs, highlight_kwargs):
        fb = MLFeedback.objects.create(**feedback_kwargs)
        if highlight_kwargs:
            highlight_kwargs.update({
                'feedback_id': fb.id,
                'highlight_type': Highlight.TYPES.PASSAGE
            })
            Highlight.objects.create(**highlight_kwargs)

    def _extract_create_feedback_kwargs(self, csv_input):
        with open(csv_input) as csvfile:
            data = DictReader(csvfile)
            for row in data:
                result = self._process_csv_row(row)
                feedback_result = result[self.FEEDBACK_KEY]
                highlight_result = result[self.HIGHLIGHT_KEY]
                if feedback_result:
                    yield {
                        self.FEEDBACK_KEY: feedback_result,
                        self.HIGHLIGHT_KEY: highlight_result,
                    }

    def _process_csv_row(self, row):
        combined_labels = row.get(self.COMBINED_LABELS_HEADER).strip()
        optimal = 'y' in row.get(self.OPTIMAL_HEADER, '').lower().strip()
        feedback = row.get(self.FEEDBACK_HEADER).strip()
        feedback_order = row.get(self.FEEDBACK_ORDER_HEADER, 1).strip()

        highlight_text = row.get(self.HIGHLIGHT_TEXT_HEADER).strip()
        highlight_skip = row.get(self.HIGHLIGHT_SKIP_HEADER, "0").strip()

        feedback_kwargs = None
        if combined_labels and feedback:
            feedback_kwargs = {
                'combined_labels': combined_labels,
                'optimal': optimal,
                'feedback': feedback,
                'order': feedback_order,
            }

        highlight_kwargs = None
        if highlight_text:
            highlight_kwargs = {
                'highlight_text': highlight_text,
                'start_index': highlight_skip,
            }

        return {
          self.FEEDBACK_KEY: feedback_kwargs,
          self.HIGHLIGHT_KEY: highlight_kwargs,
        }

    def _drop_existing_feedback_records(self, prompt_id):
        MLFeedback.objects.filter(prompt_id=prompt_id).delete()
