# frozen_string_literal: true

RSpec.shared_context "Stripe Plan Data" do
  let(:stripe_price_id) { 'price_1Kda5QBuKMgoObiutaXbaIhO' }

  before { create(:teacher_paid_plan, stripe_price_id: stripe_price_id ) }
end
