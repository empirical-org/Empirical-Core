# frozen_string_literal: true

RSpec.shared_context 'Stripe Sources' do
  include_context 'Stripe Card'

  let(:stripe_sources) do
    Stripe::ListObject.construct_from(
      object: 'list',
      data: [stripe_card],
      has_more: false,
      url: '/v1/payment_methods'
    )
  end
end
