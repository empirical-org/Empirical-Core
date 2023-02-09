# frozen_string_literal: true

class VerifyEmailsController < ApplicationController

  def verify_by_staff
    user = User.find(staff_verification_params[:user_id])

    user.verify_email(UserEmailVerification::STAFF_VERIFICATION)

    render json: user
  end

  def verify_by_token
    token = token_verification_params[:token]

    verification = UserEmailVerification.find_by(verification_token: token)

    return render json: {'error': 'Invalid verification token'}, status: 400 unless verification

    verification.verify(UserEmailVerification::EMAIL_VERIFICATION, token)
    render json: {}, status: :ok
  rescue UserEmailVerification::UserEmailVerificationError => e
    render json: {'error': e}, status: 400
  end

  private def staff_verification_params
    params.permit(:user_id)
  end

  private def token_verification_params
    params.permit(:token)
  end
end
