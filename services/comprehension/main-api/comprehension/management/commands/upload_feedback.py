from csv import DictReader

from django.core.management.base import BaseCommand

from ...models.ml_feedback import MLFeedback


class Command(BaseCommand):
    help = 'Parses a CSV for feedback records'

    COMBINED_LABELS_HEADER = 'Revised Shortened Single Label'
    OPTIMAL_HEADER = None
    FEEDBACK1_HEADER = 'Feedback #1 (Question)'
    FEEDBACK2_HEADER = 'Feedback #2 (Imperative)'


    def add_arguments(self, parser):
        parser.add_argument('prompt_id', metavar='PROMPT_ID',
                            help='The database ID of the prompt')
        parser.add_argument('csv_input', metavar='CSV_PATH',
                            help='The path to the input CSV file')

    def handle(self, *args, **kwargs):
        prompt_id = kwargs['prompt_id']
        csv_input = kwargs['csv_input']

        self._drop_existing_feedback_records(prompt_id)

        for feedback_kwargs in self._extract_create_feedback_kwargs(csv_input):
            feedback_kwargs.update({
                'prompt_id': prompt_id,
            })
            MLFeedback.objects.create(**feedback_kwargs)

    def _extract_create_feedback_kwargs(self, csv_input):
        with open(csv_input) as csvfile:
            data = DictReader(csvfile)
            for row in data:
                combined_labels = row[self.COMBINED_LABELS_HEADER]
                optimal = False
                feedback1 = row[self.FEEDBACK1_HEADER]
                feedback2 = row[self.FEEDBACK2_HEADER]

                if not combined_labels:
                    continue

                if feedback1:
                    yield {
                        'combined_labels': combined_labels,
                        'optimal': optimal,
                        'feedback': feedback1,
                        'order': 1,
                    }
                if feedback2:
                    yield {
                        'combined_labels': combined_labels,
                        'optimal': optimal,
                        'feedback': feedback2,
                        'order': 2,
                    }

    def _drop_existing_feedback_records(self, prompt_id):
        MLFeedback.objects.filter(prompt_id=prompt_id).delete()
