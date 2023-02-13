# frozen_string_literal: true

require 'rails_helper'

describe ApprovedAdminVerificationEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:school) { create(:school) }

    it 'should send the new admin email' do
      expect_any_instance_of(Mailer::User).to receive(:send_approved_admin_email).with(school.name)
      subject.perform(user.id, school.id)
    end
  end
end
