# frozen_string_literal: true

require 'rails_helper'

describe UserRequestedAdminVerificationEmailWorker do
  let(:job) { described_class.new}
  let(:admin) { create(:admin) }

  describe '#perform' do
    it 'should send the stats email' do
      expect(UserMailer).to receive(:user_requested_admin_verification_email)
        .with(admin)
        .and_return(double('mailer', deliver_now!: true))

      job.perform(admin.id)
    end
  end
end
