# frozen_string_literal: true

RSpec.shared_context "Stripe Plan" do
  let(:stripe_price_id) { "price_#{SecureRandom.hex}" }

  before { create(:teacher_paid_plan, stripe_price_id: stripe_price_id ) }
end
