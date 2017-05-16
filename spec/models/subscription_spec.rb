require 'rails_helper'

describe Subscription, type: :model do
  describe "start premium when subscription" do
    let!(:user) { FactoryGirl.create(:user) }
    let!(:subscription) { FactoryGirl.create(:subscription) }
    let!(:user_subscription) {FactoryGirl.create(:user_subscription, user: user, subscription: subscription)}

    context "updates the expirary to the later of one year from today or July 1, 2018 if" do
      it "is a trial user" do
        subscription.update(account_type: 'trial')
        Subscription.start_premium(user.id)
        july_1_2017 = Date.new(2017, 7, 1)
        expected_date = [Date.today, july_1_2017].max + 365
        expect(subscription.reload.expiration).to eq(expected_date)
      end
      
      it "is a paid user" do
        subscription.update(account_type: 'paid')
        Subscription.start_premium(user.id)
        july_1_2017 = Date.new(2017, 7, 1)
        expected_date = [Date.today, july_1_2017].max + 365
        expect(subscription.reload.expiration).to eq(expected_date)
      end

    end
  end

  describe "start premium when no subscription" do
    let(:user) { FactoryGirl.create(:user) }

    it "creates one" do
      expect {
        Subscription.start_premium(user.id)
      }.to change { Subscription.count }.by(1)
    end

    it "gives the subscription an expiration of to the later of one year from today or July 1, 2018" do
      Subscription.start_premium(user.id)
      july_1_2017 = Date.new(2017, 7, 1)
      expected_date = [Date.today, july_1_2017].max + 365
      expect(user.reload.subscription.expiration).to eq(expected_date)
    end
  end

  describe "update_or_create_with_user_join" do
    it "creates a subscription based off of the passed attributes" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'paid'}
      new_sub = Subscription.update_or_create_with_user_join(12, attributes)
      expect(new_sub.account_limit).to eq(1000)
      expect(new_sub.account_type).to eq('paid')
    end

    it "makes a matching UserSubscription join" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'paid'}
      new_sub = Subscription.update_or_create_with_user_join(12, attributes)
      join = new_sub.user_subscriptions.first
      expect([join.user_id, join.subscription_id]).to eq([12, new_sub.id])
    end
  end

  describe "update_or_create_with_school_join" do
    let!(:queens_school) { FactoryGirl.create :school, name: "Queens Charter School", zipcode: '11385'}

    it "creates a subscription based off of the passed attributes" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'paid'}
      new_sub = Subscription.update_or_create_with_school_join(queens_school.id, attributes)
      expect(new_sub.account_limit).to eq(1000)
      expect(new_sub.account_type).to eq('paid')
    end

    it "makes a matching SchoolSubscription join" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'paid'}
      new_sub = Subscription.update_or_create_with_school_join(queens_school.id, attributes)
      join = new_sub.school_subscriptions.first
      expect([join.school_id, join.subscription_id]).to eq([queens_school.id, new_sub.id])
    end
  end
end
