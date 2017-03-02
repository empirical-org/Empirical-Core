require 'rails_helper'

describe Subscription, type: :model do
  describe "start premium when subscription" do
    let(:user) { FactoryGirl.create(:user) }
    let!(:subscription) { FactoryGirl.create(:subscription, user: user) }

    it "updates the expirary to the later of one year from today or July 1, 2018" do
        Subscription.start_premium(user)
        july_1_2017 = Date.new(2017, 7, 1)
        expected_date = [Date.today, july_1_2017].max + 365
        expect(subscription.reload.expiration).to eq(expected_date)
    end
  end

  describe "start premium when no subscription" do
    let(:user) { FactoryGirl.create(:user) }

    it "creates one" do
      expect {
        Subscription.start_premium(user)
      }.to change { Subscription.count }.by(1)
    end

    it "gives the subscription an expiration of to the later of one year from today or July 1, 2018" do
      Subscription.start_premium(user)
      july_1_2017 = Date.new(2017, 7, 1)
      expected_date = [Date.today, july_1_2017].max + 365
      expect(user.reload.subscriptions.last.expiration).to eq(expected_date)
    end
  end
end
