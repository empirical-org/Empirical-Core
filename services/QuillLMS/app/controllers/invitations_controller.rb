class InvitationsController < ApplicationController
  before_action :verify_current_user_owns_classrooms, only: :create_coteacher_invitation
  before_action :set_classroom_ids_and_inviteee_email, only: :create_coteacher_invitation


  def create_coteacher_invitation
    begin
      validate_email_and_classroom_ids
      @pending_invite = find_or_create_coteacher_invite_from_current_user
      raise StandardError.new(@pending_invite.errors[:base].join(" ")) unless @pending_invite.valid?
      assign_classrooms_to_invitee
      invoke_email_worker
      render json: { invite_id: @pending_invite.id }
    rescue => e
      render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_to_specific_invitee
    begin
      Invitation.find_by(invitation_type: params[:invitation_type], inviter_id: current_user.id, invitee_email: params[:invitee_email], archived: false).destroy
      render json: {}
    rescue => e
      render json: { error: e.message }, status: 422
    end
  end

  def destroy_pending_invitations_from_specific_inviter
    begin
      Invitation.find_by(invitation_type: params[:invitation_type], inviter_id: params[:inviter_id], invitee_email: current_user.email, archived: false).destroy
      render json: {}
    rescue => e
      render json: { error: e.message }, status: 422
    end
  end

  private

  def invoke_email_worker
    if Rails.env.production? || @invitee_email.match('quill.org')
      InvitationEmailWorker.perform_async(@pending_invite.id)
    end
  end

  def find_or_create_coteacher_invite_from_current_user
    Invitation.find_or_create_by(inviter_id: current_user.id, invitee_email: @invitee_email, invitation_type: Invitation::TYPES[:coteacher], archived: false)
  end

  def validate_email_and_classroom_ids
    validate_empty_classroom_ids_or_email
    validate_email_format
  end

  def validate_empty_classroom_ids_or_email
    if @classroom_ids.empty? || @invitee_email.empty?
      raise StandardError.new("Please make sure you've entered a valid email and selected at least one classroom.")
    end
  end

  def validate_email_format
    unless @invitee_email =~ /.+@.+\..+/i
      raise StandardError.new("Please make sure you've entered a valid email.")
    end
  end

  def set_classroom_ids_and_inviteee_email
    @classroom_ids = params[:classroom_ids]
    @invitee_email = params[:invitee_email]
  end


  def verify_current_user_owns_classrooms
    multiple_classroom_owner?(params[:classroom_ids])
  end

  def assign_classrooms_to_invitee
    extant_invitations_for_classrooms = @pending_invite.coteacher_classroom_invitations.pluck(:classroom_id)
    @classroom_ids.each do |id|
      if extant_invitations_for_classrooms.exclude?(id)
        invite = CoteacherClassroomInvitation.create(invitation_id: @pending_invite.id, classroom_id: id)
        raise StandardError.new(invite.errors[:base].join(" ")) unless invite.valid?
      end
    end
  end
end
