# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::StudentEmailUpdater do
  let(:data) { { email: email, google_id: google_id } }

  subject { described_class.new(data) }

  context 'invalid email' do
    let(:email) { nil }
    let(:google_id) { '123' }

    it { should_not_run_update_email }
  end

  context 'valid email' do
    let(:email) { 'student@example.com' }

    context 'invalid google_id' do
      let(:google_id) { nil }

      it { should_not_run_update_email }
    end

    context 'valid google_id' do
      let(:google_id) { '123' }

      context 'no student exists with google_id' do
        it { should_not_run_update_email }
      end

      context 'student exists with google_id' do
        let!(:student) { create :student, google_id: google_id, email: previous_email }

        context 'previous_email == email' do
          let(:previous_email) { email }

          it { should_not_run_update_email }
        end

        context 'previous_email != email' do
          let(:previous_email) { "previous_#{email}" }

          context 'another user has email' do
            let!(:another_student) { create :student, email: email }

            it { should_not_run_update_email }
          end

          context 'no other user has email' do
            it 'should update student email' do
              expect do
                subject.run
                student.reload
              end.to change(student, :email).from(previous_email).to(email)
            end
          end
        end
      end
    end
  end

  def should_not_run_update_email
    expect(subject).not_to receive(:update_email)
    subject.run
  end
end
