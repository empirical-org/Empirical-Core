# frozen_string_literal: true

# == Schema Information
#
# Table name: user_subscriptions
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  subscription_id :integer
#  user_id         :integer
#
# Indexes
#
#  index_user_subscriptions_on_subscription_id  (subscription_id)
#  index_user_subscriptions_on_user_id          (user_id)
#
require 'rails_helper'

describe UserSubscription, type: :model do
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:subscription_id) }

  it { should belong_to(:user) }
  it { should belong_to(:subscription) }

  it { is_expected.to callback(:send_premium_emails).after(:create) }

  let!(:user1) { create(:user) }
  let!(:user2) { create(:user) }
  let!(:new_sub) { create(:subscription) }
  let!(:old_sub) { create(:subscription) }
  let!(:user_sub) { create(:user_subscription, user_id: user1.id, subscription_id: old_sub.id) }

  context 'validates' do
    describe 'presence of' do
      it 'subscription_id' do
        expect { user_sub.update!(user_id: nil) }.to raise_error(ActiveRecord::RecordInvalid)
      end

      it 'user_id' do
        expect { user_sub.update!(subscription_id: nil) }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end

  describe '#send_premium_emails' do
    let(:user) { create(:user, email: 'test@quill.org') }
    let(:subscription) { create(:subscription) }
    let!(:user_subscription) { create(:user_subscription, user: user, subscription: subscription) }

    context 'when account type is not teacher trial and the school subscriptions are not empty' do
      before do
        allow(subscription).to receive(:school_subscriptions).and_return([])
        allow(subscription).to receive(:account_type).and_return('anything but teacher trial')
      end

      it 'should send the premium email' do
        expect { user_subscription.send_premium_emails }.to change(PremiumUserSubscriptionEmailWorker.jobs, :size).by(1)
      end
    end

    context 'when account type is not teacher trial' do
      before do
        allow(subscription).to receive(:school_subscriptions).and_return(['filled_array'])
        allow(subscription).to receive(:account_type).and_return('anything but teacher trial')
      end

      it 'should send the premium email' do
        expect { user_subscription.send_premium_emails }.to change(PremiumSchoolSubscriptionEmailWorker.jobs, :size).by(1)
      end
    end
  end

  context '#self.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub' do
    let!(:user) { create(:user, email: 'test@quill.org') }
    let!(:subscription) { create(:subscription) }
    let!(:user_subscription) { create(:user_subscription, user: user, subscription: subscription) }

    describe 'when the user does have the passed subscription' do
      it "does not call #self.create_user_sub_from_school_sub" do
        expect(UserSubscription).not_to receive(:create_user_sub_from_school_sub)
        UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user.id, subscription.id)
      end

      it "does call #self.create_user_sub_from_school_sub" do
        expect(UserSubscription).to receive(:create_user_sub_from_school_sub)
        user_subscription.destroy
        UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user.id, subscription.id)
      end
    end
  end

  context '#self.create_user_sub_from_school_sub' do
    it 'creates a new UserSubscription' do
      old_user_sub_count = user1.user_subscriptions.count
      UserSubscription.create_user_sub_from_school_sub(user1.id, new_sub.id)
      expect(user1.reload.user_subscriptions.count).to eq(old_user_sub_count + 1)
    end

    it 'associates the user with the passed subscription' do
      expect(user1.subscription).to eq(old_sub)
      UserSubscription.create_user_sub_from_school_sub(user1.id, new_sub.id)
      expect(user1.reload.subscription).to eq(new_sub)
    end

    it 'calls #self.redeem_present_and_future_subscriptions_for_credit with the user_id' do
      expect(UserSubscription).to receive(:redeem_present_and_future_subscriptions_for_credit).with(user1.id)
      UserSubscription.create_user_sub_from_school_sub(user1.id, new_sub.id)
    end
  end

  context '#self.redeem_present_and_future_subscriptions_for_credit' do
    let!(:new_user_sub) { create(:user_subscription, user_id: user1.id, subscription_id: new_sub.id) }

    it "sets existing present and future subscription's de_activated_date to today" do
      expect(user1.subscriptions.map(&:de_activated_date)).not_to include(Date.current)
      UserSubscription.redeem_present_and_future_subscriptions_for_credit(user1.id)
      expect(user1.subscriptions.reload.map(&:de_activated_date)).to include(Date.current)
    end
  end
end
