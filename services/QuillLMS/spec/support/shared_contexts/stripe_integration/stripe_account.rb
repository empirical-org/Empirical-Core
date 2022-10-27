# frozen_string_literal: true

RSpec.shared_context 'Stripe Account' do
  let(:stripe_account_id) { "acct_#{SecureRandom.hex}"}

  let(:stripe_account) do
    Stripe::Account.construct_from(
      id: stripe_account_id,
      object: "account",
      business_profile: {
        name: "Business Name",
        support_address: {
          city: "Springfield",
          country: "US",
          line1: "123 Fake Street"
        },
        support_email: "support@example.com",
        support_phone: "8675309",
        url: "https://www.example.com"
      },
      capabilities: {},
      charges_enabled: true,
      controller: {
        type: "account"
      },
      country: "US",
      default_currency: "usd",
      details_submitted: true,
      email: "business@example.com",
      payouts_enabled: true,
      settings: {}
    )
  end
end
