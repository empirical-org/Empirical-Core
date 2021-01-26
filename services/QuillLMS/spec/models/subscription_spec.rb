# == Schema Information
#
# Table name: subscriptions
#
#  id                   :integer          not null, primary key
#  account_type         :string
#  de_activated_date    :date
#  expiration           :date
#  payment_amount       :integer
#  payment_method       :string
#  purchaser_email      :string
#  recurring            :boolean          default(FALSE)
#  start_date           :date
#  created_at           :datetime
#  updated_at           :datetime
#  purchaser_id         :integer
#  subscription_type_id :integer
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#
require 'rails_helper'
require 'ostruct'

describe Subscription, type: :model do
  describe '#is_trial?' do
    let!(:subscription) { create(:subscription) }


    it "returns true if the subscription is in Subscription::TRIAL_TYPES" do
      Subscription::TRIAL_TYPES.each do |tt|
        subscription.update(account_type: tt)
        expect(subscription.is_trial?).to be
      end
    end
    it "returns false if the subscription is not Subscription::TRIAL_TYPES" do
      Subscription::ALL_PAID_TYPES.each do |tt|
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
      let(:user_subscription_2) { create(:user_subscription, subscription: subscription, user: user) }
      let!(:school) { create(:school) }
      let(:school_subscription) { create(:school_subscription, subscription: subscription, school: school) }

      it 'is a subscription with multiple users_subscriptions linked' do
        user_subscription_2
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

  describe "#self.give_teacher_premium_if_charge_succeeds" do
    let!(:user) { create(:user) }
    let!(:subscription) { build(:subscription, expiration: Date.new(2018,4,6), purchaser: user) }

    before do
      Subscription.any_instance.stub(:charge_user_for_teacher_premium).and_return({status: 'succeeded'})
    end

    it "calls #Subscription.new_teacher_premium_sub" do
      Subscription.should receive(:new_teacher_premium_sub).with(user).and_return(subscription)
      Subscription.give_teacher_premium_if_charge_succeeds(user)
    end

    it "calls #Subscription.save_if_charge_succeeds" do
      expect_any_instance_of(Subscription).to receive(:save_if_charge_succeeds)
      Subscription.give_teacher_premium_if_charge_succeeds(user)
    end

    it "creates a new subscription when the charge succeeds" do
      old_sub_count = Subscription.count
      Subscription.give_teacher_premium_if_charge_succeeds(user)
      expect(Subscription.count - old_sub_count).to eq(1)
    end

    it "creates a new user-subscription join when the charge succeeds" do
      old_user_sub_count = UserSubscription.count
      Subscription.give_teacher_premium_if_charge_succeeds(user)
      expect(UserSubscription.count - old_user_sub_count).to eq(1)
    end

    it "creates a new subscription with the correct payment amount" do
      new_sub = Subscription.give_teacher_premium_if_charge_succeeds(user)
      expect(new_sub.payment_amount).to eq(Subscription::TEACHER_PRICE)
    end

    it "creates a new subscription with the correct payment method" do
      new_sub = Subscription.give_teacher_premium_if_charge_succeeds(user)
      expect(new_sub.payment_method).to eq('Credit Card')
    end

    it "creates a new subscription with the correct contact" do
      new_sub = Subscription.give_teacher_premium_if_charge_succeeds(user)
      expect(new_sub.purchaser).to eq(user)
    end

    context 'when the charge does not suceed' do
      before do
        Subscription.any_instance.stub(:charge_user_for_teacher_premium).and_return({status: 'failed'})
      end

      it "does not create a new subscription when the charge succeeds" do
        old_sub_count = Subscription.count
        Subscription.give_teacher_premium_if_charge_succeeds(user)
        expect(Subscription.count - old_sub_count).to eq(0)
      end

      it "does not create a new user-subscription join when the charge succeeds" do
        old_user_sub_count = UserSubscription.count
        Subscription.give_teacher_premium_if_charge_succeeds(user)
        expect(UserSubscription.count - old_user_sub_count).to eq(0)
      end

    end
  end

  describe "#self.give_school_premium_if_charge_succeeds" do
    let!(:school) { create(:school) }
    let!(:user) { create(:user) }
    let!(:subscription) { build(:subscription, expiration: Date.new(2018,4,6), purchaser: user, account_type: 'School Paid') }
    # let!(:school_sub) {build(:school_subscription, school: school, subscription: subscription)}

    before do
      Subscription.any_instance.stub(:charge_user_for_school_premium).and_return({status: 'succeeded'})
    end

    it "calls #Subscription.new_school_premium_sub" do
      Subscription.should receive(:new_school_premium_sub).with(school, user).and_return(subscription)
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
        Subscription.any_instance.stub(:charge_user_for_school_premium).and_return({status: 'failed'})
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

  describe "#self.school_or_user_has_ever_paid?" do
    let!(:subscription) { create(:subscription) }
    let!(:user) { create(:user) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }
    it "responds with true if school or user has ever had anything in the ALL_PAID_TYPES_LIST" do
      Subscription::ALL_PAID_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid?(user)).to be
      end
    end

    it "responds with false if school or user has only had things in the ALL_FREE_TYPES_LIST" do
      Subscription::ALL_FREE_TYPES.each do |type|
        subscription.update(account_type: type)
        expect(Subscription.school_or_user_has_ever_paid?(user)).not_to be
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
      let!(:user_with_extant_subscription) { create(:user) }
      let!(:extant_subscription ) { Subscription.create_with_user_join(user_with_extant_subscription.id, expiration: Date.today + 365, account_type: 'Teacher Paid') }
      let!(:user_with_no_extant_subscription) { create(:user) }
      let!(:user_with_expired_extant_subscription) { create(:user) }
      let!(:extant_expired_subscription ) { Subscription.create_with_user_join(user_with_expired_extant_subscription.id, expiration: Date.today - 1, account_type: 'Teacher Paid') }

      it 'creates a trial subscription with an expiration in 30 days if there is no extant subscription' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_no_extant_subscription.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it 'creates a trial subscription with an expiration in 30 days if there is an expired extant subscription' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_expired_extant_subscription.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it 'create a trial subscription with an expiration 31 days after the extant subscription expiration' do
        attributes = { account_type: 'Teacher Trial' }
        new_sub = Subscription.create_with_user_join(user_with_extant_subscription.id, attributes)
        expect(new_sub.expiration).to eq(extant_subscription.expiration + 31)
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

  context 'recurring subscriptions' do
    let!(:teacher_with_stripe_customer_id) {create(:teacher, :has_a_stripe_customer_id)}
    let!(:subscription) {create(:subscription)}
    let!(:recurring_subscription_expiring_today_1) { create(:subscription, purchaser_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true) }
    let!(:recurring_subscription_expiring_today_2) { create(:subscription, purchaser_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true) }
    let!(:recurring_subscription_expiring_but_de_activated) { create(:subscription, purchaser_id: teacher_with_stripe_customer_id.id, expiration: Date.today, recurring: true, de_activated_date: Date.today) }
    let!(:recurring_subscription_expiring_tomorrow) { create(:subscription, purchaser_id: teacher_with_stripe_customer_id.id, expiration: Date.today + 1, recurring: true) }
    let!(:non_recurring_subscription_expiring_today) { create(:subscription, purchaser_id: teacher_with_stripe_customer_id.id, expiration: Date.today + 1, recurring: false) }
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

        it "sets recurring to false if expiration is more than 7 days old" do
          recurring_subscription_expiring_today_1.expiration = 10.days.ago
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
          expect(recurring_subscription_expiring_today_1.recurring).to eq(false)
        end

        it "does not set recurring to false if expiration is less than 7 days old" do
          recurring_subscription_expiring_today_1.expiration = 3.days.ago
          recurring_subscription_expiring_today_1.update_if_charge_succeeds
          expect(recurring_subscription_expiring_today_1.recurring).to eq(true)
        end
      end
    end

    describe '#renew_subscription' do
      let!(:school) { create(:school_with_three_teachers) }

      it "sets the date it was called as the de_activated_date" do
        subscription.renew_subscription
        expect(subscription.de_activated_date).to eq(Date.today)
      end

      it "creates a new subscription" do
        old_sub_count = Subscription.count
        subscription.renew_subscription
        expect(Subscription.count).to eq(old_sub_count + 1)
      end

      it "creates a new subscription with an expiration date that is 365 days more" do
        subscription.renew_subscription
        expect(Subscription.last.expiration).to eq(subscription.expiration + 365)
      end

      it "creates a new subscription with the same schools as the original subscription" do
        subscription.schools.push(school)
        subscription.renew_subscription
        expect(Subscription.last.schools).to eq([school])
      end

      it "creates a new subscription with the same users as the original subscription" do
        subscription.users.push(User.all)
        subscription.renew_subscription
        expect(Subscription.last.users).to eq(User.all)
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
        expect(subscription.renewal_price).to eq(Subscription::TEACHER_PRICE)
      end
    end

    describe 'self.expired_today_or_previously_and_recurring' do
      it "returns all subscriptions where the expiration date is today and recurring is true and de_activated_date is null" do
        expect(Subscription.expired_today_or_previously_and_recurring).to contain_exactly(recurring_subscription_expiring_today_1, recurring_subscription_expiring_today_2)
      end

      it "returns no subscriptions where the de_activated_date is not null" do
        expect(Subscription.expired_today_or_previously_and_recurring).to contain_exactly(recurring_subscription_expiring_today_1, recurring_subscription_expiring_today_2)
      end

      it "does not return subscriptions just because they expire today" do
        expect(Subscription.expired_today_or_previously_and_recurring).not_to include(non_recurring_subscription_expiring_today)
      end

      it "does not return subscriptions just because they are recurring" do
        expect(Subscription.expired_today_or_previously_and_recurring).not_to include(recurring_subscription_expiring_tomorrow)
      end

      it "does not return subscriptions that are neither recurring nor expiring today" do
        expect(Subscription.expired_today_or_previously_and_recurring).not_to include(subscription)
      end
    end
  end




end
