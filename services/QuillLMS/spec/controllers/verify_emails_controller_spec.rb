# frozen_string_literal: true

require 'rails_helper'

describe VerifyEmailsController do
  let(:token) { SecureRandom.uuid }
  let(:user) { create(:user) }
  let!(:user_email_verification) { create(:user_email_verification, verification_token: token, user: user) }

  describe '#verify_by_staff' do
    it 'should successfully mark a user as having a verified email when Quill staff says it should be' do
      post :verify_by_staff, params: { user_id: user.id }, format: :json

      expect(response.status).to be(200)
      expect(user.reload.email_verified?).to be(true)
      expect(user_email_verification.reload.verification_method).to eq(UserEmailVerification::STAFF_VERIFICATION)
    end
  end

  describe '#verify_by_token' do
    it 'should successfully mark a user as having a verified email when passed a valid token' do
      post :verify_by_token, params: { token: token }, format: :json

      expect(response.status).to be(200)
      expect(user.reload.email_verified?).to be(true)
      expect(user_email_verification.reload.verification_method).to eq(UserEmailVerification::EMAIL_VERIFICATION)
    end
  end
end
