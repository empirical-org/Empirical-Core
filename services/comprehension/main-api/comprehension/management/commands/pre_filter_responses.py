import csv

from django.core.management.base import BaseCommand

from ...views.plagiarism import PlagiarismFeedbackView


class Command(BaseCommand):
    help = 'Parses a CSV for feedback records'

    def add_arguments(self, parser):
        parser.add_argument('passage_source', metavar='PASSAGE_SOURCE',
                            help='The path to the file with the passage')
        parser.add_argument('csv_input', metavar='CSV_PATH',
                            help='The path to the input CSV file')

    def handle(self, *args, **kwargs):
        passage_source = kwargs['passage_source']
        csv_input = kwargs['csv_input']

        passage_text = self._retrieve_passage(passage_source)

        with open(csv_input, 'r') as csv_in,\
                open(f'filtered_{csv_input}', 'w') as csv_out:
            reader = csv.reader(csv_in)
            writer = csv.writer(csv_out)
            for row in reader:
                entry = row[0]
                word_count = len(entry.split(' '))
                if PlagiarismFeedbackView._check_is_plagiarism(
                    passage_text,
                    entry
                ):
                    continue
                if word_count < 3 or word_count > 100:
                    continue
                writer.writerow(row)

    def _retrieve_passage(self, passage_path):
        with open(passage_path, 'r') as f:
            return f.read()
