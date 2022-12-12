# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::WebhooksController, type: :controller do
  include_context "Stripe Invoice Paid Event"

  let(:stub_construct_event) { allow(Stripe::Webhook).to receive(:construct_event) }
  let(:handle_event_worker) { StripeIntegration::Webhooks::HandleEventWorker }

  describe '#create' do
    context 'valid event payload' do
      let(:stripe_event_id) { "evt_#{SecureRandom.hex}" }
      let(:event) { stripe_event }

      before { stub_construct_event.and_return(event) }

      it 'stripe webhook is created' do
        expect(handle_event_worker).to receive(:perform_async)
        post :create
        expect(response.status).to eq 200
      end
    end

    context 'stripe_webhook_event with external_id already exists' do
      let(:stripe_event_id) { "evt_#{SecureRandom.hex}" }
      let(:event) { stripe_event }
      let!(:stripe_webhook_event) { create(:stripe_webhook_event, external_id: stripe_event_id) }

      before { stub_construct_event.and_return(event) }

      it 'new event is not handled' do
        expect(handle_event_worker).not_to receive(:perform_async)
        post :create
        expect(response.status).to eq 200
      end
    end

    context 'invalid payload' do
      let(:error) { JSON::ParserError.new }

      before { stub_construct_event.and_raise(error) }

      it "handles the JSON format error and reports to new relic" do
        expect(handle_event_worker).not_to receive(:perform_async)
        expect(ErrorNotifier).to receive(:report).with(error)
        post :create
        expect(response.status).to eq 400
      end
    end

    context 'webhook signature verification failed' do
      let(:error) { Stripe::SignatureVerificationError.new('verifiation failed', 'sig_header') }

      before { stub_construct_event.and_raise(error) }

      it 'handles the signature error and reports to new relic' do
        expect(handle_event_worker).not_to receive(:perform_async)
        expect(ErrorNotifier).to receive(:report).with(error)
        post :create
        expect(response.status).to eq 400
      end
    end

    context 'other types of errors' do
      let(:stripe_event_id) { "evt_#{SecureRandom.hex}" }
      let(:event) { double(:webhook_event, id: stripe_event_id, data: {}, type: nil) }

      before { stub_construct_event.and_return(event) }

      it 'unexpected errors' do
        expect(handle_event_worker).not_to receive(:perform_async)
        expect(ErrorNotifier).to receive(:report)
        post :create
        expect(response.status).to eq 400
      end
    end
  end
end
