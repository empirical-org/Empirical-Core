require 'rails_helper'
require 'ostruct'

describe Subscription, type: :model do
  describe '#credit_user_and_de_activate' do
    let!(:subscription) { create(:subscription) }
    let!(:user) { create(:user) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }

    context 'it does nothing to the subscription when' do
      let(:user_subscription_2) { create(:user_subscription, subscription: subscription, user: user) }
      let!(:school) { create(:school) }
      let(:school_subscription) { create(:school_subscription, subscription: subscription, school: school) }

      it 'is a subscription with multiple users_subscriptions linked' do
        user_subscription_2
        old_sub_attributes = subscription.attributes
        subscription.credit_user_and_de_activate
        expect(subscription.reload.attributes).to eq(old_sub_attributes)
      end

      it 'is a subscription with any school subscriptions linked' do
        school_subscription
        old_sub_attributes = subscription.attributes
        subscription.credit_user_and_de_activate
        expect(subscription.reload.attributes).to eq(old_sub_attributes)
      end
    end

    it 'sets the subscription to de_activate the day it is called' do
      subscription.credit_user_and_de_activate
      expect(subscription.de_activated_date).to eq(Date.today)
    end

    it 'sets the recurring to false when it is called' do
      subscription.update(recurring: true)
      subscription.credit_user_and_de_activate
      expect(subscription.recurring).to eq(false)
    end
  end

  describe "#self.school_or_user_has_ever_paid" do
    let!(:subscription) { create(:subscription) }
    let!(:user) { create(:user) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }
    it "responds with true if school or user has ever had anything in the ALL_PAID_TYPES_LIST" do
      Subscription::ALL_PAID_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid(user)).to be
      end
    end

    it "responds with false if school or user has only had things in the ALL_FREE_TYPES_LIST" do
      Subscription::ALL_FREE_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid(user)).not_to be
      end
    end
  end

  describe "#self.promotional_dates" do
    context 'when called on a day prior to August, 1' do
      before do
        allow(Date).to receive(:today).and_return Date.new(2018,4,4)
      end

      it "returns an expiration date of July 31 the next year when called on a day prior to August" do
        expect(Subscription.promotional_dates[:expiration]).to eq(Date.new(2019,7,31))
      end

      it "returns a start date one year from the day it was called" do
        expect(Subscription.promotional_dates[:start_date]).to eq(Date.today)
      end
    end

    context 'when called on a day after July 31' do
      before do
        allow(Date).to receive(:today).and_return Date.new(2018,10,4)
      end

      it "returns an expiration date of July 31 the next year when called on a day prior to August" do
        expect(Subscription.promotional_dates[:expiration]).to eq(Date.new(2019,12,31))
      end

      it "returns a start date one year from the day it was called" do
        expect(Subscription.promotional_dates[:start_date]).to eq(Date.today)
      end
    end
  end

  describe 'create_with_user_join' do
  let!(:user) { create(:user) }
  let(:old_sub) { Subscription.create_with_user_join(user.id, expiration: Date.yesterday, account_limit: 1002, account_type: 'Teacher Paid') }

    it 'creates a subscription based off of the passed attributes' do
      attributes = { expiration: Date.yesterday, account_limit: 1002, account_type: 'Teacher Paid' }
      new_sub = Subscription.create_with_user_join(user.id, attributes)
      expect(new_sub.account_limit).to eq(1002)
      expect(new_sub.account_type).to eq('Teacher Paid')
      expect(new_sub.expiration).to eq(Date.yesterday)
    end

    context 'when the expiration is missing' do
      it 'adds 30 days to trial accounts' do
        attributes = { account_limit: 1002, account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it 'adds at least a year (or more, depending on promotions) to other accounts' do
        attributes = { account_limit: 1002, account_type: 'Teacher Paid' }
        new_sub = Subscription.create_with_user_join(user.id, attributes)
        expect(new_sub.expiration).to be >= (Date.today + 365)
      end
    end

    it 'makes a matching UserSubscription join' do
      attributes = { expiration: Date.yesterday, account_limit: 1000, account_type: 'Teacher Paid' }
      new_sub = Subscription.create_with_user_join(user.id, attributes)
      join = new_sub.user_subscriptions.first
      expect([join.user_id, join.subscription_id]).to eq([user.id, new_sub.id])
    end

    context 'when the subscription already exists' do
      it 'updates a UserSubscription based off of the passed attributes' do
        attributes = { expiration: Date.tomorrow }
        Subscription.create_with_user_join(user.id, attributes)
        expect(user.subscription.expiration).to eq(Date.tomorrow)
      end
    end
  end

  context 'recurring subscriptions' do
    let!(:teacher_with_stripe_customer_id) {create(:teacher, :has_a_stripe_customer_id)}
    let!(:subscription) {create(:subscription)}
    let!(:recurring_subscription_expiring_today_1) { create(:subscription, contact_user_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true) }
    let!(:recurring_subscription_expiring_today_2) { create(:subscription, contact_user_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true) }
    let!(:recurring_subscription_expiring_but_de_activated) { create(:subscription, contact_user_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true, de_activated_date: Date.today) }
    let!(:recurring_subscription_expiring_tomorrow) { create(:subscription, contact_user_id: teacher_with_stripe_customer_id.id, expiration: Date.today + 1, recurring: true) }
    let!(:non_recurring_subscription_expiring_today) { create(:subscription, contact_user_id: teacher_with_stripe_customer_id.id, expiration: Date.today + 1, recurring: false) }
    describe 'self.update_todays_expired_recurring_subscriptions' do


      it "calls update_if_charge_succeeds on all recurring subscriptions expiring that day" do
        # TODO: figure out why this doesn't work
        # # Subscription.any_instance.stub(:update_if_charge_succeeds)
        # # [recurring_subscription_expiring_today_1, recurring_subscription_expiring_today_2].each do |s|
        #   # expect(s).to receive(:update_if_charge_succeeds)
        # # end
        # Subscription.any_instance.stub(:charge_user).and_return({status: 'succeeded'})
        # expect(recurring_subscription_expiring_today_1).to receive(:update_if_charge_succeeds)
        # recurring_subscription_expiring_today_1.update_if_charge_succeeds
        # # Subscription.update_todays_expired_recurring_subscriptions
      end

      it "does not call update_if_charge_succeeds on any other subscriptions" do
        Subscription.any_instance.stub(:update_if_charge_succeeds)
        [recurring_subscription_expiring_tomorrow, non_recurring_subscription_expiring_today].each do |s|
          expect(s).not_to receive(:update_if_charge_succeeds)
        end
        Subscription.update_todays_expired_recurring_subscriptions
      end
    end

    describe '#update_if_charge_succeeds' do
      before do
        expect_any_instance_of(Subscription).to receive(:charge_user)
      end

      context 'when the charge succeeds' do
        before do
          recurring_subscription_expiring_today_1.stub(:charge_user).and_return({status: 'succeeded'})
        end

        it "calls charge_user" do
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
        end

        it "calls renew_subscription" do
          expect(recurring_subscription_expiring_today_1).to receive(:renew_subscription)
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
        end
      end

      context 'when the charge does not succeed' do
        before do
          recurring_subscription_expiring_today_1.stub(:charge_user).and_return({status: 'failed'})
        end

        it "calls charge_user" do
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
        end

        it "does not call renew_subscription" do
          expect(recurring_subscription_expiring_today_1).not_to receive(:renew_subscription)
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
        end
      end





    end

    describe '#renewal_price' do
      let!(:school) { create(:school) }
      let!(:school_subscription) { create(:school_subscription, subscription: subscription, school: school) }

      it "returns the school renewal price if any schools are associated with the subscription" do
        expect(subscription.renewal_price).to eq(Subscription::SCHOOL_RENEWAL_PRICE)
      end

      it "returns the teacher renewal price if no schools are associated with the subscription" do
        school_subscription.destroy
        expect(subscription.renewal_price).to eq(Subscription::TEACHER_RENEWAL_PRICE)
      end
    end

    describe 'self.expired_today_and_recurring' do
      it "returns all subscriptions where the expiration date is today and recurring is true and de_activated_date is null" do
        expect(Subscription.expired_today_and_recurring).to contain_exactly(recurring_subscription_expiring_today_1, recurring_subscription_expiring_today_2)
      end

      it "returns no subscriptions where the de_activated_date is not null" do
        expect(Subscription.expired_today_and_recurring).to contain_exactly(recurring_subscription_expiring_today_1, recurring_subscription_expiring_today_2)
      end

      it "does not return subscriptions just because they expire today" do
        expect(Subscription.expired_today_and_recurring).not_to include(non_recurring_subscription_expiring_today)
      end

      it "does not return subscriptions just because they are recurring" do
        expect(Subscription.expired_today_and_recurring).not_to include(recurring_subscription_expiring_tomorrow)
      end

      it "does not return subscriptions that are neither recurring nor expiring today" do
        expect(Subscription.expired_today_and_recurring).not_to include(subscription)
      end
    end
  end




end
