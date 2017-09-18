require 'rails_helper'

describe UserSubscription, type: :model do
let!(:user_1) {FactoryGirl.create(:user)}
let!(:user_2) {FactoryGirl.create(:user)}
let!(:new_sub) { FactoryGirl.create(:subscription)}
let!(:old_sub) { FactoryGirl.create(:subscription)}
let!(:user_sub) {FactoryGirl.create(:user_subscription, user_id: user_1.id, subscription_id: old_sub.id)}

  context "validates" do
    describe "uniqueness of" do

      it "user_id" do
        expect{UserSubscription.create(subscription_id: 2, user_id: user_sub.user_id)}.to raise_error
      end
    end

    describe "presence of" do
      it "subscription_id" do
        expect{user_sub.update!(user_id: nil)}.to raise_error
      end

      it "user_id" do
        expect{user_sub.update!(subscription_id: nil)}.to raise_error
      end
    end

  end

  context "UserSubscription.update_or_create" do

    it "updates existing UserSubscriptions to the new subscription_id" do
      # TODO: figure out why this fails inconsistently
      expect(user_sub.subscription_id).to eq(old_sub.id)
      UserSubscription.update_or_create(user_1.id, new_sub.id)
      expect(user_sub.reload.subscription_id).to eq(new_sub.id)
    end

    it "creates new UserSubscriptions with the passed subscription_id and user_id" do
      UserSubscription.update_or_create(99, 11)
      new_user_sub = UserSubscription.last
      expect([new_user_sub.user_id, new_user_sub.subscription_id]).to eq([99,11])
    end
  end

end
