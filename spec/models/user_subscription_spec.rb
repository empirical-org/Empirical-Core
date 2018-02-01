require 'rails_helper'

describe UserSubscription, type: :model do
let!(:user_1) {create(:user)}
let!(:user_2) {create(:user)}
let!(:new_sub) { create(:subscription)}
let!(:old_sub) { create(:subscription)}
let!(:user_sub) {create(:user_subscription, user_id: user_1.id, subscription_id: old_sub.id)}

  context "validates" do

    describe "presence of" do
      it "subscription_id" do
        expect{user_sub.update!(user_id: nil)}.to raise_error
      end

      it "user_id" do
        expect{user_sub.update!(subscription_id: nil)}.to raise_error
      end
    end

  end

  context "#self.create_user_sub_from_school_sub" do
    it "creates a new UserSubscription" do
      old_user_sub_count = user_1.user_subscriptions.count
      UserSubscription.create_user_sub_from_school_sub(user_1.id, new_sub.id)
      expect(user_1.reload.user_subscriptions.count).to eq(old_user_sub_count + 1)
    end

    it "associates the user with the passed subscription" do
      expect(user_1.subscription).to eq(old_sub)
      UserSubscription.create_user_sub_from_school_sub(user_1.id, new_sub.id)
      expect(user_1.reload.subscription).to eq(new_sub)
    end

    it "calls #self.redeem_present_and_future_subscriptions_for_credit with the user_id " do
      UserSubscription.should receive(:redeem_present_and_future_subscriptions_for_credit).with(user_1.id)
      UserSubscription.create_user_sub_from_school_sub(user_1.id, new_sub.id)
    end
  end

  context "#self.redeem_present_and_future_subscriptions_for_credit" do
    let!(:new_user_sub) {create(:user_subscription, user_id: user_1.id, subscription_id: new_sub.id)}

    it "sets extant present and future subscriptions to expire today" do
      expect(user_1.subscriptions.map(&:expiration)).not_to include(Date.today)
      UserSubscription.redeem_present_and_future_subscriptions_for_credit(user_1.id)
      expect(user_1.subscriptions.reload.map(&:expiration)).to include(Date.today)
    end
  end

end
