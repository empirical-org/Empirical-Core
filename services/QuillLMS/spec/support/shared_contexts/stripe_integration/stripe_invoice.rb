# frozen_string_literal: true

RSpec.shared_context 'Stripe Invoice' do
  include_context 'Stripe Subscription'

  let(:stripe_invoice_id) { "in_#{SecureRandom.hex}" }

  let(:stripe_invoice) do
    Stripe::Invoice.construct_from(
      id: stripe_invoice_id,
      object: "invoice",
      account_country: "US",
      account_name: "Quill.org",
      account_tax_ids: nil,
      amount_due: 2000,
      amount_paid: 2000,
      amount_remaining: 0,
      application_fee_amount: nil,
      attempt_count: 1,
      attempted: true,
      auto_advance: false,
      automatic_tax: {
        enabled: false,
        status: nil
      },
      billing_reason: "manual",
      charge: "ch_3KkstuBuKMgoObiu1D4Di7Qr",
      collection_method: "charge_automatically",
      created: 1649090229,
      currency: "usd",
      custom_fields: nil,
      customer: stripe_customer_id,
      customer_address: nil,
      customer_email: customer_email,
      customer_name: nil,
      customer_phone: nil,
      customer_shipping: nil,
      customer_tax_exempt: "none",
      customer_tax_ids: [],
      default_payment_method: nil,
      default_source: nil,
      default_tax_rates: [],
      description: "(created by Stripe CLI)",
      discount: nil,
      discounts: [],
      due_date: nil,
      ending_balance: 0,
      footer: nil,
      hosted_invoice_url: "https://invoice.stripe.com/i/acct_15nIVJBuKMgoObiu/test_YWNjdF8xNW5JVkpCdUtNZ29PYml1LF9MUm1TNURneE1INEJaRXVIQjBOc0J2QXE2MWtVTG5GLDM5NjMxMDMz0200kvh49rcg?s=ap",
      invoice_pdf: "https://pay.stripe.com/invoice/acct_15nIVJBuKMgoObiu/test_YWNjdF8xNW5JVkpCdUtNZ29PYml1LF9MUm1TNURneE1INEJaRXVIQjBOc0J2QXE2MWtVTG5GLDM5NjMxMDMz0200kvh49rcg/pdf?s=ap",
      last_finalization_error: nil,
      lines: {
        object: "list",
        data: [
          {
            id: 'il_1KBuKMoOiuZJCasdfasjCZ',
            object: "line_item",
            amount: 2000,
            currency: "usd",
            description: "(created by Stripe CLI)",
            discount_amounts: [],
            discountable: true,
            discounts: [],
            invoice_item: "ii_1KkstsBuKMgoObiut67gmrW8",
            livemode: false,
            metadata: {},
            period: {
              end: 1649090228,
              start: 1649090228
              },
            plan: nil,
            price: stripe_price,
            proration: false,
            proration_details: {
              credited_items: nil
            },
            quantity: 1,
            subscription: nil,
            tax_amounts: [],
            tax_rates: [],
            type: "invoiceitem"
          }
        ],
        has_more: false,
        total_count: 1,
        url: "/v1/invoices/in_1KksttBuKMgoObiuVhbUpUTt/lines"
      },
      livemode: false,
      metadata: {},
      next_payment_attempt: nil,
      number: "0E048F0A-0001",
      on_behalf_of: nil,
      paid: true,
      paid_out_of_band: false,
      payment_intent: "pi_3KkstuBuKMgoObiu1lAJwt8H",
      payment_settings: {
        payment_method_options: nil,
        payment_method_types: nil
      },
      period_end: 1649090229,
      period_start: 1649090229,
      post_payment_credit_notes_amount: 0,
      pre_payment_credit_notes_amount: 0,
      quote: nil,
      receipt_number: nil,
      starting_balance: 0,
      statement_descriptor: nil,
      status: "paid",
      status_transitions: {
        finalized_at: 1649090230,
        marked_uncollectible_at: nil,
        paid_at: 1649090230,
        voided_at: nil
      },
      subscription: stripe_subscription_id,
      subtotal: 2000,
      tax: nil,
      test_clock: nil,
      total: 2000,
      total_discount_amounts: [],
      total_tax_amounts: [],
      transfer_data: nil,
      webhooks_delivered_at: nil
    )
  end
end
