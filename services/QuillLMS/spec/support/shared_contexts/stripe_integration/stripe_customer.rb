# frozen_string_literal: true

RSpec.shared_context 'Stripe Customer' do
  let(:customer_email) { 'customer@example.com' }
  let(:stripe_customer_id) { "cus_#{SecureRandom.hex}" }
  let!(:customer) { create(:user, email: customer_email) }
end
