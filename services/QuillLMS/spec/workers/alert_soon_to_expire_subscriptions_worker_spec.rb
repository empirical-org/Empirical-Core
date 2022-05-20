# frozen_string_literal: true

require 'rails_helper'

describe AlertSoonToExpireSubscriptionsWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:analytics) { double(:analytics) }
    let!(:user) { create(:user) }
    let(:school) { create(:school)}
    let!(:subscription) { create(:subscription, account_type: 'Teacher Paid', recurring: true, expiration: Time.zone.today + 30.days)}
    let!(:another_subscription) { create(:subscription, account_type: 'School Paid', recurring: false, expiration: Time.zone.today + 30.days)}
    let(:user_subscription) { create(:user_subscription, user: user, subscription: subscription)}
    let(:school_subscription) { create(:school_subscription, school: school, subscription: subscription)}

    before do
      allow(SegmentAnalytics).to receive(:new) { analytics }
    end

    it 'should trigger the teacher subscription will expire event in segment' do
      expect(analytics).to receive(:trigger_teacher_subscription_will_expire).with(subscription.id)
      expect(analytics).to receive(:trigger_school_subscription_will_expire).with(another_subscription.id)
      subject.perform
    end

    it 'should not trigger the event for subscriptions that are not expiring in 30 days' do
      user = create(:user)
      non_expired_subscription = create(:subscription, account_type: 'Teacher Paid', recurring: true, expiration: Time.zone.today + 90.days)
      create(:user_subscription, user: user, subscription: non_expired_subscription)

      expect(analytics).not_to receive(:trigger_teacher_subscription_will_expire).with(non_expired_subscription.id)
      expect(analytics).to receive(:trigger_teacher_subscription_will_expire).with(subscription.id)
      expect(analytics).to receive(:trigger_school_subscription_will_expire).with(another_subscription.id)
      subject.perform
    end
  end
end
