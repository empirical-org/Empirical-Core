require 'rails_helper'

describe UserSubscription, type: :model do

  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:subscription_id) }

  it { should belong_to(:user) }
  it { should belong_to(:subscription) }

  it { is_expected.to callback(:send_premium_emails).after(:commit) }

let!(:user_1) {create(:user)}
let!(:user_2) {create(:user)}
let!(:new_sub) { create(:subscription)}
let!(:old_sub) { create(:subscription)}
let!(:user_sub) {create(:user_subscription, user_id: user_1.id, subscription_id: old_sub.id)}

  describe '#send_premium_emails' do
    let(:user) { create(:user, email: 'test@quill.org') }
    let(:subscription) { create(:subscription) }
    let(:user_subscription) { create(:user_subscription, user: user, subscription: subscription) }

    context 'when account type is not teacher trial and the school subscriptions are not empty' do
      before do
        allow(subscription).to receive(:school_subscriptions).and_return([])
        allow(subscription).to receive(:account_type).and_return("anything but teacher trial")
      end
      
      it 'should send the premium email' do
        expect{ user_subscription.send_premium_emails }.to change(PremiumUserSubscriptionEmailWorker.jobs, :size).by(1)
      end
    end

    context 'when account type is not teacher trial' do
      before do
        allow(subscription).to receive(:school_subscriptions).and_return(["filled_array"])
        allow(subscription).to receive(:account_type).and_return("anything but teacher trial")
      end

      it 'should send the premium email' do
        expect{ user_subscription.send_premium_emails }.to change(PremiumSchoolSubscriptionEmailWorker.jobs, :size).by(1)
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
