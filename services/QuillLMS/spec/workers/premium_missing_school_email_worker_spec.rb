# frozen_string_literal: true

require 'rails_helper'

describe PremiumMissingSchoolEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    it 'should send the premium school missing email' do
      expect_any_instance_of(User).to receive(:send_premium_school_missing_email)
      subject.perform(user.id)
    end
  end
end
