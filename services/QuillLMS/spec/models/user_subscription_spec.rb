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

  let!(:user1) { create(:user) }
  let!(:user2) { create(:user) }
  let!(:new_sub) { create(:subscription) }
  let!(:old_sub) { create(:subscription) }
  let!(:user_sub) { create(:user_subscription, user: user1, subscription: old_sub) }

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

  context '#self.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub' do
    let!(:user) { create(:user, email: 'test@quill.org') }
    let!(:subscription) { create(:subscription) }
    let!(:user_subscription) { create(:user_subscription, user: user, subscription: subscription) }

    describe 'when the user does have the passed subscription' do
      it "does not call #self.create_user_sub_from_school_sub" do
        expect(UserSubscription).not_to receive(:create_user_sub_from_school_sub)
        UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user, subscription)
      end

      it "does call #self.create_user_sub_from_school_sub" do
        expect(UserSubscription).to receive(:create_user_sub_from_school_sub)
        user_subscription.destroy
        UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user, subscription)
      end
    end
  end

  context '#self.create_user_sub_from_school_sub' do
    it 'creates a new UserSubscription' do
      old_user_sub_count = user1.user_subscriptions.count
      UserSubscription.create_user_sub_from_school_sub(user1, new_sub)
      expect(user1.reload.user_subscriptions.count).to eq(old_user_sub_count + 1)
    end

    it 'associates the user with the passed subscription' do
      expect(user1.subscription).to eq(old_sub)
      UserSubscription.create_user_sub_from_school_sub(user1, new_sub)
      expect(user1.reload.subscription).to eq(new_sub)
    end

    it 'calls #self.redeem_present_and_future_subscriptions_for_credit with the user_id' do
      expect(UserSubscription).to receive(:redeem_present_and_future_subscriptions_for_credit).with(user1)
      UserSubscription.create_user_sub_from_school_sub(user1, new_sub)
    end
  end

  context '#self.redeem_present_and_future_subscriptions_for_credit' do
    let!(:new_user_sub) { create(:user_subscription, user: user1, subscription: new_sub) }

    it "sets existing present and future subscription's de_activated_date to today" do
      expect(user1.subscriptions.map(&:de_activated_date)).not_to include(Date.current)
      UserSubscription.redeem_present_and_future_subscriptions_for_credit(user1)
      expect(user1.subscriptions.reload.map(&:de_activated_date)).to include(Date.current)
    end
  end
end
