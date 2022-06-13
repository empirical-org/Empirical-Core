# frozen_string_literal: true

class ReferralsController < ApplicationController
  before_action :teacher!

  def index
    @referral_link = current_user.referral_link
    @referral_count = current_user.referrals
    @earned_months = current_user.earned_months
    @unredeemed_credits = current_user.unredeemed_credits
  end

  def invite
    # NOTE: to future developers: you may be tempted to check that this user
    # does not already exist in the database and decide not to send the email
    # if so. Do not do this as it has the potential to leak information about
    # which email addresses have accounts on Quill.org.
    invitation_email = params['email']
    inviter_hash = {
      'email' => current_user.email,
      'name' => current_user.name
    }

    if (Rails.env.production? || (inviter_hash['email'].match('quill.org') && invitation_email.match('quill.org'))) && UserMailer.referral_invitation_email(inviter_hash, invitation_email).deliver_now!
      return render json: {}
      end

    render json: { error: 'Something hath gone awry.' }, status: 500
  end
end
