# frozen_string_literal: true

RSpec.shared_context "Stripe Checkout Session Completed Data" do
  include_context "Stripe Subscription Data"

  let(:stripe_checkout_session_data) do
    Stripe::Checkout::Session.construct_from(
      "object": {
        "id": "cs_test_a1EgGmYJac61jaksdjafklsadjflEvmvgdn60I",
        "object": "checkout.session",
        "after_expiration": nil,
        "allow_promotion_codes": nil,
        "amount_subtotal": 8000,
        "amount_total": 8000,
        "automatic_tax": {
          "enabled": false,
          "status": nil
        },
      },
      "billing_address_collection": nil,
      "cancel_url": "http://localhost:3000/premium",
      "client_reference_id": nil,
      "consent": nil,
      "consent_collection": nil,
      "currency": "usd",
      "customer": stripe_customer_id,
      "customer_creation": "always",
      "customer_details": {
        "email": customer_email,
        "phone": nil,
        "tax_exempt": "none",
        "tax_ids": []
      },
      "customer_email": customer_email,
      "expires_at": 1647970794,
      "livemode": false,
      "locale": nil,
      "metadata": {},
      "mode": "subscription",
      "payment_intent": nil,
      "payment_link": nil,
      "payment_method_options": nil,
      "payment_method_types": [
        "card"
      ],
      "payment_status": "paid",
      "phone_number_collection": {
        "enabled": false
      },
      "recovered_from": nil,
      "setup_intent": nil,
      "shipping": nil,
      "shipping_address_collection": nil,
      "shipping_options": [],
      "shipping_rate": nil,
      "status": "complete",
      "submit_type": nil,
      "subscription": stripe_subscription_id,
      "success_url": "http://localhost:3000/premium.html?success=true",
      "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
      },
      "url": nil
    ).to_json
  end
end
