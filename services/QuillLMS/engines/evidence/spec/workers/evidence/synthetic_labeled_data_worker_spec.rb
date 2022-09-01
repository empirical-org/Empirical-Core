# frozen_string_literal: true

require 'rails_helper'

module Evidence
  describe SyntheticLabeledDataWorker, type: :worker do
    subject { described_class.new }

    context 'perform' do
      let(:filename) {'test.csv'}
      let(:mock_uploader) { double(file: file) }
      let(:file) { fixture_file_upload(filename) }
      let(:file_as_array) {[['hello', 'world'], ['data','here']]}

      let(:activity) { create(:evidence_activity) }

      let(:generator_response) { double }

      let(:email_subject) {"Evidence Labeled Synthetic Data: #{activity.id} - #{activity.title}"}

      let(:mailer) { double('mailer', deliver_now!: true) }

      it 'call generate and call file_mailer' do
        expect(FileUploader).to receive(:new).and_return(mock_uploader)
        expect(mock_uploader).to receive(:retrieve_from_store!).with(filename)

        expect(Evidence::Synthetic::LabeledDataGenerator).to receive(:csvs_from_run)
          .with(file_as_array, filename)
          .and_return(generator_response)

        expect(FileMailer).to receive(:send_multiple_files)
          .with('synthetic-data-exports@quill.org', email_subject, generator_response)
          .and_return(mailer)

        subject.perform(filename, activity.id)
      end
    end
  end
end
