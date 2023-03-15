# frozen_string_literal: true

require 'rails_helper'

describe IdentifyStripeInvoicesWithoutSubscriptionsWorker do
  include_context 'Stripe Invoice'

  subject { described_class.new }

  describe '#perform' do
    let(:mailer_double) { double(deliver_now!: nil) }
    let(:charge_double) { double(amount: 100, amount_refunded: 0) }

    before do
      list_double = double
      allow(list_double).to receive(:auto_paging_each).and_yield(stripe_invoice)

      allow(Stripe::Invoice).to receive(:list).and_return(list_double)
      allow(Stripe::Charge).to receive(:retrieve).and_return(charge_double)
    end

    it 'should send an email that includes invoices with no associated Quill Subscriptions' do
      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([{
        id: stripe_invoice.id,
        created: Time.at(stripe_invoice.created).getlocal.to_datetime,
        total: stripe_invoice.total / 100.0,
        customer_name: stripe_invoice.customer_name,
        customer_email: stripe_invoice.customer_email,
        number: stripe_invoice.number
      }]).and_return(mailer_double)

      subject.perform
    end

    it 'should send an email that does not include invoices that are not of status open or paid' do
      expect(stripe_invoice).to receive(:status).and_return('void')

      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([]).and_return(mailer_double)

      subject.perform
    end

    it 'should send an email that does not include invoices associated with Quill Subscriptions' do
      create(:subscription, stripe_invoice_id: stripe_invoice_id)

      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([]).and_return(mailer_double)

      subject.perform
    end

    it 'should send an email that does not include invoices for $0' do
      expect(stripe_invoice).to receive(:amount_due).and_return(0)

      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([]).and_return(mailer_double)

      subject.perform
    end

    it 'should send an email that does not include invoices that have been refunded' do
      expect(charge_double).to receive(:amount_refunded).and_return(100)

      expect(StripeIntegration::Mailer).to receive(:invoices_without_subscriptions).with([]).and_return(mailer_double)

      subject.perform
    end
  end
end
