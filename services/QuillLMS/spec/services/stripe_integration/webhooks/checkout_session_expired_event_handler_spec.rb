# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::CheckoutSessionExpiredEventHandler do
  include_context 'Stripe Checkout Session Expired Event'

  let!(:stripe_checkout_session) do
    create(:stripe_checkout_session, external_checkout_session_id: external_checkout_session_id)
  end

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:external_id) { stripe_webhook_event.external_id }
  let(:stripe_checkout_session_status) { 'expired' }

  subject { described_class.run(stripe_webhook_event) }

  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  it { expect { subject }.to change { stripe_checkout_session.reload.expiration } }
end
