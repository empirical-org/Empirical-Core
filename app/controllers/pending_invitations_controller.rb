class PendingInvitationsController < ApplicationController
  before_action :verify_current_user_owns_classrooms, only: :create_coteacher_invitation

  def create_coteacher_invitation
    begin
      @classroom_ids = params[:classroom_ids]
      invitee_email = params[:invitee_email]

      raise StandardError.new("Please make sure you've entered a valid email and selected at least one classroom.") if @classroom_ids.empty? || invitee_email.empty?
      raise StandardError.new("Please make sure you've entered a valid email.") unless invitee_email =~ /.+@.+\..+/i
      @pending_invite = PendingInvitation.find_or_create_by(inviter_id: current_user.id, invitee_email: invitee_email, invitation_type: PendingInvitation::TYPES[:coteacher])
      assign_classrooms_to_invitee
      return render json: {invite_id: @pending_invite.id}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_to_specific_invitee
    begin
      PendingInvitation.find_by(invitation_type: params[:invitation_type], inviter_id: current_user.id, invitee_email: params[:invitee_email]).destroy
      return render json: {}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_from_specific_inviter
    begin
      PendingInvitation.find_by(invitation_type: params[:invitation_type], inviter_id: params[:inviter_id], invitee_email: current_user.email).destroy
      return render json: {}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end

  private

  def verify_current_user_owns_classrooms
    multiple_classroom_owner?(params[:classroom_ids])
  end

  def assign_classrooms_to_invitee
    classroom_invitations = @classroom_ids.map{|id| {pending_invitation_id: @pending_invite.id, classroom_id: id}}
    CoteacherClassroomInvitation.bulk_insert(values: classroom_invitations)
  end
end
