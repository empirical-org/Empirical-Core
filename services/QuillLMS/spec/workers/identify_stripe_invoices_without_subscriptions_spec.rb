# frozen_string_literal: true

require 'rails_helper'

describe IdentifyStripeInvoicesWithoutSubscriptions do
  include_context 'Stripe Invoice'

  subject { described_class.new }

  describe '#perform' do
    let(:mailer_double) { double(deliver_now!: nil) }

    before do
      allow(subject).to receive(:stripe_invoices).and_return([stripe_invoice])
    end

    it 'should send an email that includes invoices with no associated Quill Subscriptions' do
      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([{
        id: stripe_invoice.id,
        created: Time.at(stripe_invoice.created).to_datetime,
        total: stripe_invoice.total / 100.0,
        customer_name: stripe_invoice.customer_name,
        customer_email: stripe_invoice.customer_email,
        number: stripe_invoice.number
      }]).and_return(mailer_double)

      subject.perform
    end

    it 'should send an email that does not include invoices associated with Quill Subscriptions' do
      create(:subscription, stripe_invoice_id: stripe_invoice_id)

      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([]).and_return(mailer_double)

      subject.perform
    end
  end
end
