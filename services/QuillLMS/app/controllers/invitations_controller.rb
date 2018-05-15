class InvitationsController < ApplicationController
  before_action :verify_current_user_owns_classrooms, only: :create_coteacher_invitation

  def create_coteacher_invitation
    begin
      @classroom_ids = params[:classroom_ids]
      invitee_email = params[:invitee_email]

      raise StandardError.new("Please make sure you've entered a valid email and selected at least one classroom.") if @classroom_ids.empty? || invitee_email.empty?
      raise StandardError.new("Please make sure you've entered a valid email.") unless invitee_email =~ /.+@.+\..+/i
      @pending_invite = Invitation.find_or_create_by(inviter_id: current_user.id, invitee_email: invitee_email, invitation_type: Invitation::TYPES[:coteacher], archived: false)
      assign_classrooms_to_invitee
      if Rails.env.production? || invitee_email.match('quill.org')
        InvitationEmailWorker.perform_async(@pending_invite.id)
      end
      return render json: {invite_id: @pending_invite.id}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_to_specific_invitee
    begin
      Invitation.find_by(invitation_type: params[:invitation_type], inviter_id: current_user.id, invitee_email: params[:invitee_email], archived: false).destroy
      return render json: {}
    rescue => e
      return render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_from_specific_inviter
    begin
      Invitation.find_by(invitation_type: params[:invitation_type], inviter_id: params[:inviter_id], invitee_email: current_user.email, archived: false).destroy
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
    extant_invitations_for_classrooms = @pending_invite.coteacher_classroom_invitations.pluck(:classroom_id)
    @classroom_ids.each do |id|
      if extant_invitations_for_classrooms.exclude?(id)
        CoteacherClassroomInvitation.create(invitation_id: @pending_invite.id, classroom_id: id)
      end
    end
  end
end
