# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                :integer          not null, primary key
#  account_type      :string
#  de_activated_date :date
#  expiration        :date
#  payment_amount    :integer
#  payment_method    :string
#  purchaser_email   :string
#  recurring         :boolean          default(FALSE)
#  start_date        :date
#  created_at        :datetime
#  updated_at        :datetime
#  plan_id           :integer
#  purchaser_id      :integer
#  stripe_invoice_id :string
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#  index_subscriptions_on_stripe_invoice_id  (stripe_invoice_id) UNIQUE
#
require 'rails_helper'
require 'ostruct'

describe Subscription, type: :model do
  context 'validations' do
    let(:subscription) { build(:subscription) }

    it 'expects stripe_invoice_id to be of a given format' do
      subscription.stripe_invoice_id = 'not_the_subscription_format'
      expect(subscription).not_to be_valid
    end
  end

  describe '#is_trial?' do
    let!(:subscription) { create(:subscription) }


    it "returns true if the subscription is in Subscription::TRIAL_TYPES" do
      Subscription::TRIAL_TYPES.each do |tt|
        subscription.update(account_type: tt)
        expect(subscription.is_trial?).to be
      end
    end

    it "returns false if the subscription is not Subscription::TRIAL_TYPES" do
      Subscription::OFFICIAL_PAID_TYPES.each do |tt|
        subscription.update(account_type: tt)
        expect(subscription.is_trial?).not_to be
      end
    end
  end

  describe 'the subscription type consts' do
    it "the official school and offical teacher types contain the same values as all offical types" do
      types_by_role = Subscription::OFFICIAL_SCHOOL_TYPES.dup.concat(Subscription::OFFICIAL_TEACHER_TYPES)
      expect(types_by_role.uniq).to match_array(Subscription::ALL_OFFICIAL_TYPES)
    end
  end

  describe '#credit_user_and_de_activate' do
    let!(:user) { create(:user) }
    let!(:subscription) { create(:subscription, expiration: Date.new(2018,4,6), purchaser: user) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }

    before do
      allow(Date).to receive(:today).and_return Date.new(2018,4,4)
    end

    context 'it does nothing to the subscription when' do
      let(:user_subscription2) { create(:user_subscription, subscription: subscription, user: user) }
      let!(:school) { create(:school) }
      let(:school_subscription) { create(:school_subscription, subscription: subscription, school: school) }

      it 'is a subscription with multiple users_subscriptions linked' do
        user_subscription2
        old_sub_attributes = subscription.reload.attributes
        subscription.credit_user_and_de_activate
        expect(subscription.reload.attributes).to eq(old_sub_attributes)
      end

      it 'is a subscription with any school subscriptions linked' do
        school_subscription
        old_sub_attributes = subscription.reload.attributes
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

    it 'creates a credit transaction for the right ammount' do
      subscription.credit_user_and_de_activate
      expect(CreditTransaction.last.amount).to eq(subscription.expiration - subscription.start_date)
    end

    it 'creates a credit transaction for the appropriate user' do
      subscription.credit_user_and_de_activate
      expect(CreditTransaction.last.user).to eq(user)
    end

    it 'creates a credit transaction with the correct source' do
      subscription.credit_user_and_de_activate
      expect(CreditTransaction.last.source).to eq(subscription)
    end
  end

  describe ".give_school_premium_if_charge_succeeds" do
    let!(:school) { create(:school) }
    let!(:user) { create(:user) }
    let!(:subscription) { build(:subscription, expiration: Date.new(2018,4,6), purchaser: user, account_type: 'School Paid') }
    # let!(:school_sub) {build(:school_subscription, school: school, subscription: subscription)}

    before do
      allow_any_instance_of(Subscription).to receive(:charge_user_for_school_premium).and_return({status: 'succeeded'})
    end

    it "calls #Subscription.new_school_premium_sub" do
      expect(Subscription).to receive(:new_school_premium_sub).with(school, user).and_return(subscription)
      Subscription.give_school_premium_if_charge_succeeds(school, user)
    end

    it "calls #Subscription.save_if_charge_succeeds" do
      expect_any_instance_of(Subscription).to receive(:save_if_charge_succeeds)
      Subscription.give_school_premium_if_charge_succeeds(school, user)
    end

    it "creates a new subscription when the charge succeeds" do
      old_sub_count = Subscription.count
      Subscription.give_school_premium_if_charge_succeeds(school, user)
      expect(Subscription.count - old_sub_count).to eq(1)
    end

    it "creates a new user-subscription join when the charge succeeds" do
      # school.users.push(user)
      old_user_sub_count = UserSubscription.count
      subby = Subscription.give_school_premium_if_charge_succeeds(school, user)
      expect(SchoolSubscription.count - old_user_sub_count).to eq(1)
    end

    it "creates a new subscription with the correct payment amount" do
      new_sub = Subscription.give_school_premium_if_charge_succeeds(school, user)
      expect(new_sub.payment_amount).to eq(Subscription::SCHOOL_FIRST_PURCHASE_PRICE)
    end

    it "creates a new subscription with the correct payment method" do
      new_sub = Subscription.give_school_premium_if_charge_succeeds(school, user)
      expect(new_sub.payment_method).to eq('Credit Card')
    end

    it "creates a new subscription with the correct contact" do
      new_sub = Subscription.give_school_premium_if_charge_succeeds(school, user)
      expect(new_sub.purchaser).to eq(user)
    end

    context 'when the charge does not suceed' do
      before do
        allow_any_instance_of(Subscription).to receive(:charge_user_for_school_premium).and_return({status: 'failed'})
      end

      it "does not create a new subscription" do
        old_sub_count = Subscription.count
        Subscription.give_school_premium_if_charge_succeeds(school, user)
        expect(Subscription.count - old_sub_count).to eq(0)
      end

      it "does not create a new school-subscription join" do
        old_school_sub_count = UserSubscription.count
        Subscription.give_school_premium_if_charge_succeeds(school, user)
        expect(SchoolSubscription.count - old_school_sub_count).to eq(0)
      end

    end
  end

  describe ".school_or_user_has_ever_paid?" do
    let!(:subscription) { create(:subscription) }
    let!(:user) { create(:user) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }

    it "responds with true if school or user has ever had anything in the OFFICIAL_PAID_TYPES_LIST" do
      Subscription::OFFICIAL_PAID_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid?(user)).to be
      end
    end

    it "responds with false if school or user has only had things in the OFFICIAL_FREE_TYPES_LIST" do
      Subscription::OFFICIAL_FREE_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid?(user)).not_to be
      end
    end
  end

  describe ".redemption_start_date" do
    let!(:school) { create(:school) }
    let!(:subscription) { create(:subscription, expiration: Date.tomorrow) }
    let!(:school_subscription) {create(:school_subscription, school: school, subscription: subscription)}

    it 'fetches the expiration date of current subscription' do
      expect(Subscription.redemption_start_date(school)).to eq(subscription.expiration)
    end
  end

  describe ".promotional_dates" do
    context 'when called on a day prior to July, 1' do
      before do
        allow(Date).to receive(:today).and_return Date.new(2018,4,4)
      end

      it "returns an expiration date of June 30 the next year when called on a day prior to July" do
        expect(Subscription.promotional_dates[:expiration]).to eq(Date.new(2019,6,30))
      end

      it "returns a start date one year from the day it was called" do
        expect(Subscription.promotional_dates[:start_date]).to eq(Date.today)
      end
    end

    context 'when called on a day after June 30' do
      before do
        allow(Date).to receive(:today).and_return Date.new(2018,10,4)
      end

      it "returns an expiration date of December 31 the next year when called on a day prior to July" do
        expect(Subscription.promotional_dates[:expiration]).to eq(Date.new(2019,12,31))
      end

      it "returns a start date one year from the day it was called" do
        expect(Subscription.promotional_dates[:start_date]).to eq(Date.today)
      end
    end
  end

  describe 'create_with_user_join' do
    let!(:user) { create(:user) }
    let(:old_sub) { Subscription.create_with_user_join(user.id, expiration: Date.yesterday, account_type: 'Teacher Paid') }

    it 'creates a subscription based off of the passed attributes' do
      attributes = { expiration: Date.yesterday, account_type: 'Teacher Paid' }
      new_sub = Subscription.create_with_user_join(user.id, attributes)
      expect(new_sub.account_type).to eq('Teacher Paid')
      expect(new_sub.expiration).to eq(Date.yesterday)
    end

    context 'when the expiration is missing' do

      it 'adds at least a year (or more, depending on promotions) to other accounts' do
        attributes = { account_type: 'Teacher Paid' }
        new_sub = Subscription.create_with_user_join(user.id, attributes)
        expect(new_sub.expiration).to be >= (Date.today + 365)
      end
    end

    context 'when the subscription type is TEACHER_TRIAL' do
      let!(:user_with_existing_subscription) { create(:user) }
      let!(:existing_subscription ) { Subscription.create_with_user_join(user_with_existing_subscription.id, expiration: Date.today + 365, account_type: 'Teacher Paid') }
      let!(:user_with_no_existing_subscription) { create(:user) }
      let!(:user_with_expired_existing_subscription) { create(:user) }
      let!(:existing_expired_subscription ) { Subscription.create_with_user_join(user_with_expired_existing_subscription.id, expiration: Date.today - 1, account_type: 'Teacher Paid') }

      it 'creates a trial subscription with an expiration in 30 days if there is no existing subscription' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_no_existing_subscription.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it 'creates a trial subscription with an expiration in 30 days if there is an expired existing subscription' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_expired_existing_subscription.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it 'create a trial subscription with an expiration 31 days after the existing subscription expiration' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_existing_subscription.id, attributes)
        expect(new_sub.expiration).to eq(existing_subscription.expiration + 31)
      end
    end

    it 'makes a matching UserSubscription join' do
      attributes = { expiration: Date.yesterday, account_type: 'Teacher Paid' }
      new_sub = Subscription.create_with_user_join(user.id, attributes)
      join = new_sub.user_subscriptions.first
      expect([join.user_id, join.subscription_id]).to eq([user.id, new_sub.id])
    end

    context 'when the subscription already exists' do
      it 'updates a UserSubscription based off of the passed attributes' do
        attributes = { expiration: Date.tomorrow }
        Subscription.create_with_user_join(user.id, attributes)
        expect(user.reload.subscription.expiration).to eq(Date.tomorrow)
      end
    end
  end
end
