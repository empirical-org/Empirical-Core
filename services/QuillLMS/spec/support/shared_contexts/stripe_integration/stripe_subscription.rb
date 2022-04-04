# frozen_string_literal: true

RSpec.shared_context 'Stripe Subscription' do
  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
end
