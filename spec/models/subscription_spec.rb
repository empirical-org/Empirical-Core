require 'rails_helper'

describe Subscription, type: :model do
  describe "start premium when subscription" do
    let(:user) { FactoryGirl.create(:user) }
    let(:subscription) { FactoryGirl.create(:subscription, user: user) }

    it "updates the expirary" do
      expect {
        Subscription.start_premium(user)
      }.to change { subscription.reload.expiration }.by(365)
    end
  end

  describe "start premium when no subscription" do
    let(:user) { FactoryGirl.create(:user) }

    it "creates one" do
      expect {
        Subscription.start_premium(user)
      }.to change { Subscription.count }.by(1)
    end
  end
end
