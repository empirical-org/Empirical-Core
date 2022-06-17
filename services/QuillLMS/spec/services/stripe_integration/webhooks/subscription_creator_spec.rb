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
    let!(:school_plan) { create(:school_premium_plan) }
    let!(:stripe_subscription_metadata) { { school_ids: [school.id].to_json } }
    let!(:other_teacher) { create(:teacher) }
    let!(:other_school) { create(:school, users: [other_teacher]) }
    let(:stripe_price_id) { STRIPE_SCHOOL_PLAN_PRICE_ID }

    context 'happy path' do
      before { allow(Plan).to receive(:find_stripe_plan!).with(stripe_price_id).and_return(school_plan) }

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
    let!(:school_plan) { create(:school_premium_plan) }

    before { allow(Plan).to receive(:find_stripe_plan!).with(stripe_price_id).and_return(school_plan) }

    it { expect { subject }.to raise_error described_class::NilSchoolError }
  end
end

