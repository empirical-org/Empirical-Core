# frozen_string_literal: true

class VerifyEmailsController < ApplicationController

  def resend_verification_email
    if current_user.user_email_verification
      current_user.user_email_verification.set_new_token
    else
      current_user.require_email_verification
    end

    current_user.user_email_verification.send_email
    render json: {}, status: 200
  end

  def require_email_verification
    current_user.require_email_verification
    current_user.user_email_verification.send_email
    
    render json: {}, status: 200
  end

  def verify_by_staff
    user = User.find(staff_verification_params[:user_id])

    user.verify_email(UserEmailVerification::STAFF_VERIFICATION)

    render json: user
  end

  def verify_by_token
    token = token_verification_params[:token]

    verification = UserEmailVerification.find_by(verification_token: token)

    return render json: {'error': 'Invalid verification token'}, status: 400 unless token && verification

    verification.verify(UserEmailVerification::EMAIL_VERIFICATION, token)
    sign_in(verification.user)

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
