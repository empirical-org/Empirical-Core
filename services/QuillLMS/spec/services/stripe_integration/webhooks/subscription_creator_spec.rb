# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SubscriptionCreator do
  include_context 'Stripe Invoice'

  subject { described_class.run(stripe_invoice, stripe_subscription) }

  let!(:customer) { create(:user, email: customer_email, stripe_customer_id: stripe_customer_id) }

  context 'teacher subscription' do
    context 'happy path' do
      it { expect { subject }.to change(Subscription, :count).from(0).to(1) }
      it { expect { subject }.to change(UserSubscription, :count).from(0).to(1) }

      it 'calls sales contact background job' do
        expect(UpdateSalesContactWorker).to receive(:perform_async).with(customer.id, SalesStageType::TEACHER_PREMIUM)
        subject
      end
    end
  end

  context 'school subscription' do
    context 'happy path' do
      let!(:teacher) { create(:teacher) }
      let!(:other_teacher) { create(:teacher) }
      let!(:school) { create :school, users: [customer, teacher]}
      let!(:school_plan) { create(:school_paid_plan) }
      let!(:stripe_subscription_metadata) { { school_ids: [school.id].to_json } }

      before { allow(Plan).to receive(:find_stripe_plan!).with(stripe_price_id).and_return(school_plan) }

      it { expect { subject }.to change(Subscription, :count).from(0).to(1) }
      it { expect { subject }.to change(SchoolSubscription, :count).from(0).to(1) }
      it { expect { subject }.to change(UserSubscription, :count).from(0).to(2) }

      it 'calls sales contact background job' do
        expect(UpdateSalesContactWorker).to receive(:perform_async).with(customer.id, SalesStageType::SCHOOL_PREMIUM)
        subject
      end
    end
  end

  context 'nil stripe_price_id' do
    before { allow(stripe_subscription.items.data.first.price).to receive(:id).and_return(nil) }

    it { expect { subject }.to raise_error described_class::NilStripePriceIdError }
  end

  context 'nil stripe_invoice_id' do
    before { allow(stripe_invoice).to receive(:id).and_return(nil) }

    it { expect { subject }.to raise_error described_class::NilStripeInvoiceIdError }
  end

  context 'stripe_invoice_id not unique' do
    before { create(:subscription, stripe_invoice_id: stripe_invoice_id) }

    it { expect { subject }.to raise_error described_class::StripeInvoiceIdNotUniqueError }
  end

  context 'plan does not exist' do
    before { allow(Plan).to receive(:find_by!).and_raise(ActiveRecord::RecordNotFound) }

    it { expect { subject }.to raise_error described_class::PlanNotFoundError }
  end

  context 'purchaser does not exist' do
    before { allow(User).to receive(:find_by!).and_raise(ActiveRecord::RecordNotFound) }

    it { expect { subject }.to raise_error described_class::PurchaserNotFoundError }
  end

  context 'school does not exist' do
    let!(:school_plan) { create(:school_paid_plan) }

    before { allow(Plan).to receive(:find_stripe_plan!).with(stripe_price_id).and_return(school_plan) }

    it { expect { subject }.to raise_error described_class::NilSchoolError }
  end
end

