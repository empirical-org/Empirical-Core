# frozen_string_literal: true

RSpec.shared_context 'Stripe Dispute' do
  let(:stripe_dispute_id) { "du_#{SecureRandom.hex}" }

  let(:stripe_dispute) do
    Stripe::Dispute.construct_from(
      id: stripe_dispute_id,
      object: 'dispute',
      amount: 8000,
      currency: 'usd',
      metadata: {},
      reason: 'subscription_canceled',
      status: stripe_dispute_status
    )
  end
end
