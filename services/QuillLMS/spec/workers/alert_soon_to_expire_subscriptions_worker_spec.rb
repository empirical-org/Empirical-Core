# frozen_string_literal: true

require 'rails_helper'

describe AlertSoonToExpireSubscriptionsWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:analytics) { double(:analytics).as_null_object }
    let!(:user) { create(:user) }
    let(:school) { create(:school)}
    let!(:renewing_teacher_subscription) { create(:subscription, payment_method: 'Credit Card', account_type: 'Teacher Paid', recurring: true, expiration: Time.zone.today + 30.days)}
    let!(:renewing_school_subscription) { create(:subscription, payment_method: 'Credit Card', account_type: 'School Paid', recurring: true, expiration: Time.zone.today + 30.days)}
    let!(:expiring_30_teacher_sub) { create(:subscription, payment_method: 'Credit Card', account_type: 'Teacher Paid', recurring: false, expiration: Time.zone.today + 30.days)}
    let!(:expiring_30_school_sub) { create(:subscription, payment_method: 'Credit Card', account_type: 'School Paid', recurring: false, expiration: Time.zone.today + 30.days)}
    let!(:expiring_14_teacher_sub) { create(:subscription, payment_method: 'Credit Card', account_type: 'Teacher Paid', recurring: false, expiration: Time.zone.today + 14.days)}
    let!(:expiring_14_school_sub) { create(:subscription, payment_method: 'Credit Card', account_type: 'School Paid', recurring: false, expiration: Time.zone.today + 14.days)}
    let(:user_subscription) { create(:user_subscription, user: user, subscription: renewing_teacher_subscription)}
    let(:school_subscription) { create(:school_subscription, school: school, subscription: renewing_school_subscription)}
    let(:user_subscription_2) { create(:user_subscription, user: user, subscription: expiring_30_teacher_subscription)}
    let(:school_subscription_2) { create(:school_subscription, school: school, subscription: expiring_30_school_subscription)}
    let(:user_subscription_3) { create(:user_subscription, user: user, subscription: expiring_14_teacher_subscription)}
    let(:school_subscription_3) { create(:school_subscription, school: school, subscription: expiring_14_school_subscription)}

    before do
      allow(SegmentAnalytics).to receive(:new) { analytics }
    end

    it 'should trigger the teacher subscription will renew event in segment' do
      expect(analytics).to receive(:track_teacher_subscription).with(renewing_teacher_subscription.id, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW)
      expect(analytics).to receive(:track_school_subscription).with(renewing_school_subscription.id, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW)
      expect(analytics).to receive(:track_teacher_subscription).with(expiring_30_teacher_sub.id, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_30)
      expect(analytics).to receive(:track_school_subscription).with(expiring_30_school_sub.id, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_30)
      expect(analytics).to receive(:track_teacher_subscription).with(expiring_14_teacher_sub.id, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_14)
      expect(analytics).to receive(:track_school_subscription).with(expiring_14_school_sub.id, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_14)
      subject.perform
    end

    it 'should not trigger the event for subscriptions that are not expiring in 30 days' do
      user = create(:user)
      non_expired_subscription = create(:subscription, account_type: 'Teacher Paid', recurring: true, expiration: Time.zone.today + 90.days)
      create(:user_subscription, user: user, subscription: non_expired_subscription)

      expect(analytics).not_to receive(:track_teacher_subscription).with(non_expired_subscription.id)
      subject.perform
    end

    it 'should not trigger the event for subscriptions that are not paid for with credit card' do
      renewing_teacher_subscription.update(payment_method: 'Invoice')

      expect(analytics).not_to receive(:track_teacher_subscription).with(renewing_teacher_subscription.id, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW)
      subject.perform
    end
  end
end
