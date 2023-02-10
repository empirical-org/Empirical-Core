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
class UserEmailVerification < ApplicationRecord
  after_create :set_new_token, unless: :verification_token

  belongs_to :user

  class UserEmailVerificationError < StandardError; end
  class InvalidVerificationMethodError < UserEmailVerificationError; end
  class InvalidVerificationTokenError < UserEmailVerificationError; end

  VERIFICATION_METHODS = [
    EMAIL_VERIFICATION = 'email',
    CLEVER_VERIFICATION = 'clever',
    GOOGLE_VERIFICATION = 'google',
    STAFF_VERIFICATION = 'staff'
  ]

  def verify(verification_method, verification_token = nil)
    raise InvalidVerificationMethodError unless VERIFICATION_METHODS.include?(verification_method)

    return verify_by_token(verification_token) if verification_method == EMAIL_VERIFICATION

    mark_as_verified(verification_method)
  end

  def verified?
    verified_at.present?
  end

  def set_new_token
    self.verification_token = SecureRandom.uuid
  end

  private def mark_as_verified(verification_method)
    update(verification_method: verification_method, verification_token: nil, verified_at: DateTime.current)
  end

  private def verify_by_token(verification_token)
    raise InvalidVerificationTokenError unless self.verification_token == verification_token

    mark_as_verified(EMAIL_VERIFICATION)
  end
end
