# frozen_string_literal: true

require 'rails_helper'

describe PremiumSchoolSubscriptionEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:teacher_with_school) }

    it 'should send the premium school subscription email' do
      user.reload
      expect_any_instance_of(User).to receive(:send_premium_school_subscription_email).with(user.school, user.school.schools_admins.first.try(:user))
      subject.perform(user.id)
    end

    it 'should exit gracefully if passed an invalid id' do
      bad_user_id = user.id * 9
      expect_any_instance_of(User).not_to receive(:send_premium_school_subscription_email)
      subject.perform(bad_user_id)
    end
  end
end
