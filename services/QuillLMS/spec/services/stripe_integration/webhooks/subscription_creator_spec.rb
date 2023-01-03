# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SubscriptionCreator do
  include_context 'Stripe Invoice'

  subject { described_class.run(stripe_invoice, stripe_subscription) }

  let!(:customer) { create(:user, email: customer_email, stripe_customer_id: stripe_customer_id) }
  let!(:school_plan) { create(:school_premium_plan) }
  let!(:school_plan_price) { Plan.stripe_school_plan.price }
  let!(:teacher_plan_price) { Plan.stripe_teacher_plan.price }

  context 'teacher subscription' do
    let(:stripe_invoice_amount_paid) { teacher_plan_price }

    context 'happy path' do
      it { expect { subject }.to change(Subscription, :count).from(0).to(1) }
      it { expect { subject }.to change(UserSubscription, :count).from(0).to(1) }

      it 'calls sales contact background job' do
        expect(UpdateSalesContactWorker).to receive(:perform_async).with(customer.id, SalesStageType::TEACHER_PREMIUM)
        subject
      end

      context 'active teacher subscription already exists' do
        let!(:subscription) { create(:subscription, plan: Plan.stripe_teacher_plan) }

        before { create(:user_subscription, user: customer, subscription: subscription) }

        it { expect { subject }.to raise_error described_class::DuplicateSubscriptionError }
      end
    end
  end

  context 'school subscription' do
    let!(:teacher) { create(:teacher) }
    let!(:school) { create(:school, users: [teacher]) }
    let!(:stripe_subscription_metadata) { { school_ids: [school.id].to_json } }
    let!(:other_teacher) { create(:teacher) }
    let!(:other_school) { create(:school, users: [other_teacher]) }
    let!(:stripe_price_id) { STRIPE_SCHOOL_PLAN_PRICE_ID }
    let!(:stripe_invoice_amount_paid) { school_plan_price }

    context 'happy path' do
      it { expect { subject }.to change(Subscription, :count).from(0).to(1) }
      it { expect { subject }.to change(SchoolSubscription, :count).from(0).to(1) }
      it { expect { subject }.to change(UserSubscription, :count).from(0).to(1) }

      it 'calls sales contact background job' do
        expect(UpdateSalesContactWorker).to receive(:perform_async).with(customer.id, SalesStageType::SCHOOL_PREMIUM)
        subject
      end
    end

    context 'active school subscription exists' do
      let!(:subscription) { create(:subscription, plan: school_plan) }

      context 'for the same school that customer belongs to' do
        before do
          create(:schools_users, school: school, user: customer)
          create(:school_subscription, school: school, subscription: subscription)
        end

        it { expect { subject }.to raise_error described_class::DuplicateSubscriptionError }
      end

      context 'for a different school that the customer belongs to' do
        before do
          create(:schools_users, school: school, user: customer)
          create(:school_subscription, school: other_school, subscription: subscription)
        end

        it { expect { subject }.not_to raise_error }
      end

      context 'for the same school that customer is school_admin' do
        before do
          create(:schools_admins, school: school, user: customer)
          create(:school_subscription, school: school, subscription: subscription)
        end

        it { expect { subject }.to raise_error described_class::DuplicateSubscriptionError }
      end

      context 'for a different school than customer is school_admin' do
        before do
          create(:schools_admins, school: school, user: customer)
          create(:school_subscription, school: other_school, subscription: subscription)
        end

        it { expect { subject }.not_to raise_error }
      end
    end
  end


  context 'nil subscription status' do
    before { allow(stripe_subscription).to receive(:respond_to?).with(:status).and_return(false) }

    it { expect { subject }.to raise_error described_class::NilSubscriptionStatusError }
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
    before { allow(User).to receive(:find_by_stripe_customer_id_or_email!).and_raise(ActiveRecord::RecordNotFound) }

    it { expect { subject }.to raise_error described_class::PurchaserNotFoundError }
  end

  context 'school does not exist' do
    let!(:stripe_price_id) { STRIPE_SCHOOL_PLAN_PRICE_ID }
    let!(:stripe_invoice_amount_paid) { school_plan_price }

    it { expect { subject }.to raise_error described_class::NilSchoolError }
  end

  context 'amount paid different than plan price' do
    let!(:stripe_invoice_amount_paid) { stripe_plan.plan.amount - 1  }

    it { expect { subject }.to raise_error described_class::AmountPaidMismatchError }

    context 'trialing plan' do
      let(:stripe_subscription_status) { described_class::TRIALING }

      it { expect { subject }.not_to raise_error }
    end
  end
end

