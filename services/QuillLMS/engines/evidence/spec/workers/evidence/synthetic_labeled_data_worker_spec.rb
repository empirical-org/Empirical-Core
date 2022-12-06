# frozen_string_literal: true

require 'rails_helper'

module Evidence
  describe SyntheticLabeledDataWorker, type: :worker do
    let(:email) { 'test@quill.org' }

    before do
      stub_const("Evidence::Synthetic::EMAIL", email)
    end

    subject { described_class.new }

    context 'perform' do

      let(:filename) {'test.csv'}
      let(:mock_uploader) { double(file: file) }
      let(:file) { fixture_file_upload(filename) }
      let(:file_as_array) {[['hello', 'world'], ['data','here']]}
      let(:activity) { create(:evidence_activity) }
      let(:passage_text) {"some passage text" * 20}
      let!(:passage) { create(:evidence_passage, activity: activity, text: passage_text) }

      let(:generator_response) { double }

      let(:email_subject) {"Evidence Labeled Synthetic Data: #{activity.id} - #{activity.title}"}

      let(:mailer) { double('mailer', deliver_now!: true) }

      it 'call generate and call file_mailer' do

        expect(FileUploader).to receive(:new).and_return(mock_uploader)
        expect(mock_uploader).to receive(:retrieve_from_store!).with(filename)

        expect(Evidence::Synthetic::LabeledDataGenerator).to receive(:csvs_from_run)
          .with(file_as_array, filename, passage_text)
          .and_return(generator_response)

        expect(FileMailer).to receive(:send_multiple_files)
          .with(email, email_subject, generator_response)
          .and_return(mailer)

        subject.perform(filename, activity.id)
      end

      context 'utf-8 encoding' do
        let(:filename) {'test_with_utf8.csv'}
        let(:file_as_array) {[['hello’s', 'world']]}

        it 'call generate and call file_mailer' do
          expect(FileUploader).to receive(:new).and_return(mock_uploader)
          expect(mock_uploader).to receive(:retrieve_from_store!).with(filename)

          expect(Evidence::Synthetic::LabeledDataGenerator).to receive(:csvs_from_run)
            .with(file_as_array, filename, passage_text)
            .and_return(generator_response)

          expect(FileMailer).to receive(:send_multiple_files)
            .with(email, email_subject, generator_response)
            .and_return(mailer)

          subject.perform(filename, activity.id)
        end
      end
    end
  end
end
