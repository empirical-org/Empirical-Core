require 'rails_helper'

describe UserSubscription, type: :model do

  context "validates" do

    let!(:user_sub) {FactoryGirl.create(:user_subscription)}

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

end
