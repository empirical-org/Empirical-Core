# frozen_string_literal: true

class VerifyEmailsController < ApplicationController

  def verify
    token = verification_params[:token]

    verification = UserEmailVerification.find_by(verification_token: token)

    return render json: {'error': 'Invalid verification token'}, status: 400 unless verification

    verification.verify(UserEmailVerification::EMAIL_VERIFICATION, token)
    render status: :ok
  rescue UserEmailVerification::UserEmailVerificationError => e
    render json: {'error': e}, status: 400
  end

  private def verification_params
    params.permit(:token)
  end
end
