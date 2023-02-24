# frozen_string_literal: true

require 'rails_helper'

describe VerifyEmailsController do
  let(:token) { SecureRandom.uuid }
  let(:user) { create(:user) }

  describe '#resend_verification_email' do

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should call send email on the user email verification' do
      user_email_verification = create(:user_email_verification, verification_token: token, user: user)
      expect(response.status).to be(200)
      expect(user_email_verification).to receive(:send_email)

      put :resend_verification_email, params: { user_id: user.id }, format: :json
    end
  end

  context 'with an existing verification record' do
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
      it 'should successfully mark a user as having a verified email when passed a valid token and sign them in' do
        expect(controller).to receive(:sign_in).with(user)
        post :verify_by_token, params: { token: token }, format: :json

        expect(response.status).to be(200)
        expect(user.reload.email_verified?).to be(true)
        expect(user_email_verification.reload.verification_method).to eq(UserEmailVerification::EMAIL_VERIFICATION)
      end

      it 'should return a 400 if no token is provided' do
        post :verify_by_token, params: {}, format: :json

        expect(response.status).to be(400)
      end

      it 'should return a 400 if the token provided does not match any verification records' do
        bad_token = "bad_#{token}"
        post :verify_by_token, params: { token: bad_token }, format: :json

        expect(response.status).to be(400)
      end
    end
  end
end
