# frozen_string_literal: true

require 'rails_helper'

module Evidence
  describe ActivitySeedDataWorker, type: :worker do
    let(:worker) { described_class.new }

    context 'perform' do
      let(:activity) { create(:evidence_activity) }
      let(:nouns) {['noun1']}
      let(:generator_response) { double }
      let(:email_subject) {"Seed Data Activity: #{activity.id} - #{activity.title}"}
      let(:mailer) { double('mailer', deliver_now!: true) }

      it 'call generate and call file_mailer' do
        expect(Evidence::Synthetic::SeedDataGenerator).to receive(:csvs_for_activity)
          .with(activity_id: activity.id, nouns: nouns)
          .and_return(generator_response)

        expect(FileMailer).to receive(:send_multiple_files)
          .with('synthetic-data-exports@quill.org', email_subject, generator_response)
          .and_return(mailer)

        worker.perform(activity.id, nouns)
      end
    end
  end
end
