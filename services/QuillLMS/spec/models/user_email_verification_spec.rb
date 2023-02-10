# frozen_string_literal: true

# == Schema Information
#
# Table name: user_email_verifications
#
#  id                  :bigint           not null, primary key
#  verification_method :string
#  verification_token  :string
#  verified_at         :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_user_email_verifications_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

describe UserEmailVerification, type: :model do
  let(:token) { 'valid_token' }
  let!(:user_email_verification) { create(:user_email_verification, verification_token: token) }

  describe '#verify' do
    it 'should raise InvalidVerificationMethodError if called with an invalid method' do
      expect do
        user_email_verification.verify('INVALID')
      end.to raise_error(UserEmailVerification::InvalidVerificationMethodError)
    end

    it 'should raise InvalidVerificationTokenError if called with EMAIL_VERIFICATION method and the token does not match' do
      expect do
        user_email_verification.verify(UserEmailVerification::EMAIL_VERIFICATION, 'invalid_token')
      end.to raise_error(UserEmailVerification::InvalidVerificationTokenError)
    end

    it 'should set verified_at to DateTime.now' do
      now = DateTime.current
      expect(DateTime).to receive(:current).and_return(now)

      expect do
        user_email_verification.verify(UserEmailVerification::STAFF_VERIFICATION)
      end.to change(user_email_verification, :verified_at).from(nil).to(now)
    end

    it 'should clear the verification_token field when verified' do
      expect do
        user_email_verification.verify(UserEmailVerification::EMAIL_VERIFICATION, token)
      end.to change(user_email_verification, :verification_token).from(token).to(nil)
    end

    it 'should set the verification_method when verified' do
      expect do
        user_email_verification.verify(UserEmailVerification::STAFF_VERIFICATION)
      end.to change(user_email_verification, :verification_method).from(nil).to(UserEmailVerification::STAFF_VERIFICATION)
    end
  end

  describe '#set_new_token' do
    it 'should set a new verification_token value' do
      new_token = '1234567890'
      expect(SecureRandom).to receive(:uuid).and_return(new_token)

      user_email_verification.set_new_token

      expect(user_email_verification.verification_token).to eq(new_token)
    end

    it 'should be called on create' do
      new_user = create(:user)
      new_token = '1234567890'
      expect(SecureRandom).to receive(:uuid).and_return(new_token)
      verification = UserEmailVerification.create(user: new_user)

      expect(verification.verification_token).to eq(new_token)
    end
  end
end
