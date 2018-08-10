require 'rails_helper'

describe PremiumSchoolSubscriptionEmailWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:user) { create(:teacher_with_school) }

    it 'should send the premium school subscription email' do
      user.reload
      expect_any_instance_of(User).to receive(:send_premium_school_subscription_email).with(user.school, user.school.schools_admins.first.try(:user))
      subject.perform(user.id)
    end
  end
end