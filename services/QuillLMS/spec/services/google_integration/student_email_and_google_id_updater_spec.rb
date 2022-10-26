# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::StudentEmailAndGoogleIdUpdater do
  subject { described_class.run(calling_user_id, email, google_id) }

  let(:calling_user_id) { nil }

  context 'invalid email' do
    let(:email) { nil }
    let(:google_id) { '123' }

    it { should_not_update_email_or_google_id }
  end

  context 'valid email' do
    let(:email) { 'student@example.com' }

    context 'invalid google_id' do
      let(:google_id) { nil }

      it { should_not_update_email_or_google_id }
    end

    context 'valid google_id' do
      let(:google_id) { '123' }

      context 'no student exists with google_id' do
        it { should_not_update_email_or_google_id }
      end

      context 'student exists with google_id' do
        let!(:student) { create :student, google_id: google_id, email: previous_email }

        context 'previous_email == email' do
          let(:previous_email) { email }

          it { should_not_update_email_or_google_id }
        end

        context 'previous_email != email' do
          let(:previous_email) { "previous_#{email}" }

          context 'another student has email' do
            let!(:another_student) { create :student, email: email }

            it 'transfers the google id' do
              expect(GoogleIntegration::GoogleIdTransferrer).to receive(:run)
              subject
            end

            it { expect { subject }.not_to change { student.reload.email } }
          end

          context 'no other user has email' do
            it { expect { subject }.to change { student.reload.email }.from(previous_email).to(email) }
          end
        end
      end
    end
  end

  def should_not_update_email_or_google_id
    expect(ChangeLog).not_to receive(:create!)
    expect(GoogleIntegration::GoogleIdTransferrer).not_to receive(:new)
    subject
  end
end
