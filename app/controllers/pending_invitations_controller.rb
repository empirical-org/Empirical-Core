class PendingInvitationsController < ApplicationController
  before_action :verify_current_user_owns_classrooms, only: :create_coteacher_invitation

  def create_coteacher_invitation
    begin
      classroom_ids = params[:classroom_ids]
      invitee_email = params[:invitee_email]

      raise StandardError.new('Missing invitee email or classroom IDs') if classroom_ids.empty? || invitee_email.empty?
      raise StandardError.new('Invalid email address') unless invitee_email =~ /.+@.+\..+/i

      PendingInvitation.find_or_create_by(inviter_id: current_user.id, invitee_email: invitee_email)

      classroom_ids.each do |id|
        # What do we do with ID? Why is this in a separate join table and not on PendingInvitation?
      end
      return render json: {}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end


  private

  def verify_current_user_owns_classrooms
    multiple_classroom_owner?(params[:classroom_ids])
  end


end
