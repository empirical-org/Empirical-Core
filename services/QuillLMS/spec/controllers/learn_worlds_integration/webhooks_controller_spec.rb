# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::WebhooksController, type: :controller do
  include_context 'LearnWorlds Enrolled Free Course Event'
  include_context 'LearnWorlds Course Completed Event'
  include_context 'LearnWorlds Earned Certificate Event'

  subject { post :create, params: params, as: :json }

  let(:webhook_signature) { SecureRandom.hex(12) }

  before { stub_const("Auth::LearnWorlds::WEBHOOK_SIGNATURE", webhook_signature) }

  context '#create' do
    before { allow(request).to receive(:env).and_return({described_class::SIGNATURE_HEADER_KEY => signature_header}) }

    context 'invalid signature' do
      let(:params) { {} }
      let(:signature_header) { 'v2=invalid-signature' }
      let(:error) { LearnWorldsIntegration::WebhooksController::InvalidSignatureError }

      it 'handles the signature error and reports to new relic' do
        expect(ErrorNotifier).to receive(:report).with(error)
        subject
        expect(response.status).to eq 400
      end
    end

    context 'valid signature' do
      let(:signature_header) { "v2=#{webhook_signature}" }

      context 'enrolled_free_course_event' do
        let(:params) {  enrolled_free_course_event }

        it { should_call_event_handler(LearnWorldsIntegration::Webhooks::EnrolledFreeCourseEventHandler)}
      end

      context 'course_completed_event' do
        let(:params) { course_completed_event }

        it { should_call_event_handler(LearnWorldsIntegration::Webhooks::CourseCompletedEventHandler)}
      end

      context 'earned_certificate_event' do
        let(:params) { earned_certificate_event }

        it { should_call_event_handler(LearnWorldsIntegration::Webhooks::EarnedCertificateEventHandler) }
      end

      context 'unknown event type' do
        let(:error) { LearnWorldsIntegration::WebhooksController::UnknownEventTypeError }
        let(:params) { { 'type' => 'anUnknownEventType', 'data' => {}} }

        it 'handles the unknown event error and reports to new relic' do
          expect(ErrorNotifier).to receive(:report).with(error)
          subject
          expect(response.status).to eq 400
        end
      end
    end
  end

  def should_call_event_handler(event_handler)
    expect(event_handler).to receive(:run).with(params['data'])
    subject
    expect(response.status).to eq 200
  end
end
