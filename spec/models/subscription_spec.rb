require 'rails_helper'

describe Subscription, type: :model do
  describe "start premium when subscription" do
    let!(:user) { FactoryBot.create(:user) }
    let!(:subscription) { FactoryBot.create(:subscription) }
    let!(:user_subscription) {FactoryBot.create(:user_subscription, user: user, subscription: subscription)}

    context "updates the expirary to the later of one year from today or July 1, 2018 if" do
      it "is a trial user" do
        subscription.update(account_type: 'Teacher Trial')
        Subscription.start_premium(user.id)
        july_1_2017 = Date.new(2017, 7, 1)
        expected_date = [Date.today, july_1_2017].max + 365
        expect(subscription.reload.expiration).to eq(expected_date)
      end

      it "is a paid user" do
        subscription.update(account_type: 'Teacher Paid')
        Subscription.start_premium(user.id)
        july_1_2017 = Date.new(2017, 7, 1)
        expected_date = [Date.today, july_1_2017].max + 365
        expect(subscription.reload.expiration).to eq(expected_date)
      end

    end
  end

  describe "start premium when no subscription" do
    let(:user) { FactoryBot.create(:user) }

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

  describe "create_or_update_with_user_join" do
    let!(:user) { FactoryBot.create(:user) }
    let(:old_sub) {Subscription.create_or_update_with_user_join(user.id, {expiration: Date.yesterday, account_limit: 1002, account_type: 'Teacher Paid'})}


    it "creates a subscription based off of the passed attributes" do
      attributes = {expiration: Date.yesterday, account_limit: 1002, account_type: 'Teacher Paid'}
      new_sub = Subscription.create_or_update_with_user_join(user.id, attributes)
      expect(new_sub.account_limit).to eq(1002)
      expect(new_sub.account_type).to eq('Teacher Paid')
      expect(new_sub.expiration).to eq(Date.yesterday)
    end

    context "when the expiration is missing" do
      it "adds 30 days to trial accounts" do
        attributes = {account_limit: 1002, account_type: 'Teacher Trial'}
        new_sub = Subscription.create_or_update_with_user_join(user.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it "adds at least a year (or more, depending on promotions) to other accounts" do
        attributes = {account_limit: 1002, account_type: 'Teacher Paid'}
        new_sub = Subscription.create_or_update_with_user_join(user.id, attributes)
        expect(new_sub.expiration).to be >= (Date.today + 365)
      end
    end

    it "makes a matching UserSubscription join" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'Teacher Paid'}
      new_sub = Subscription.create_or_update_with_user_join(user.id, attributes)
      join = new_sub.user_subscriptions.first
      expect([join.user_id, join.subscription_id]).to eq([user.id, new_sub.id])
    end

    context 'when the subscription already exists' do

      it 'updates a UserSubscription based off of the passed attributes' do
          attributes = {expiration: Date.tomorrow}
          Subscription.create_or_update_with_user_join(user.id, attributes)
          expect(user.subscription.expiration).to eq(Date.tomorrow)
      end

    end
  end

  describe "create_or_update_with_school_join" do
    let!(:queens_school) { FactoryBot.create :school, name: "Queens Charter School", zipcode: '11385'}

    it "creates a subscription based off of the passed attributes" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'Teacher Paid'}
      new_sub = Subscription.create_or_update_with_school_join(queens_school.id, attributes)
      expect(new_sub.account_limit).to eq(1000)
      expect(new_sub.account_type).to eq('Teacher Paid')
    end

    it 'updates current subscription, if the school has one already' do
      expect(queens_school.subscription).to eq(nil)
    end

    context "when the expiration is missing" do
      it "adds 30 days to trial accounts" do
        attributes = {account_limit: 1002, account_type: 'Teacher Trial'}
        new_sub = Subscription.create_or_update_with_school_join(queens_school.id, attributes)
        expect(new_sub.expiration).to eq(Date.today + 30)
      end

      it "adds at least a year (or more, depending on current promotions) to other accounts" do
        attributes = {account_limit: 1002, account_type: 'Teacher Paid'}
        new_sub = Subscription.create_or_update_with_school_join(queens_school.id, attributes)
        expect(new_sub.expiration).to be >= (Date.today + 365)
      end
    end

    it "makes a matching SchoolSubscription join" do
      attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'Teacher Paid'}
      new_sub = Subscription.create_or_update_with_school_join(queens_school.id, attributes)
      join = new_sub.school_subscriptions.first
      expect([join.school_id, join.subscription_id]).to eq([queens_school.id, new_sub.id])
    end

    context 'when the subscription already exists' do

      it 'updates a SchoolSubscription based off of the passed attributes' do
          attributes = {expiration: Date.yesterday, account_limit: 1000, account_type: 'Teacher Paid'}
          Subscription.create_or_update_with_school_join(queens_school.id, attributes)
          attributes = {expiration: Date.tomorrow}
          Subscription.create_or_update_with_school_join(queens_school.id, attributes)
          expect(queens_school.subscription.expiration).to eq(Date.tomorrow)
      end

    end
  end

end
