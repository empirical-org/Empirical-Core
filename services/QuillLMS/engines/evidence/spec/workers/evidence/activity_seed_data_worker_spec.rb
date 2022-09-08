# frozen_string_literal: true

require 'rails_helper'

module Evidence
  describe ActivitySeedDataWorker, type: :worker do
    let(:email) { 'test@quill.org' }

    before do
      stub_const("Evidence::Synthetic::EMAIL", email)
    end

    subject { described_class.new }

    context 'perform' do
      let(:activity) { create(:evidence_activity) }
      let(:nouns) {['noun1']}
      let(:generator_response) { double }
      let(:email_subject) {"Evidence Seed Data: Activity #{activity.id} - #{activity.title}"}
      let(:mailer) { double('mailer', deliver_now!: true) }

      it 'call generate and call file_mailer' do
        expect(Evidence::Synthetic::SeedDataGenerator).to receive(:csvs_for_activity)
          .with(activity_id: activity.id, nouns: nouns)
          .and_return(generator_response)

        expect(FileMailer).to receive(:send_multiple_files)
          .with(email, email_subject, generator_response)
          .and_return(mailer)

        subject.perform(activity.id, nouns)
      end
    end
  end
end
