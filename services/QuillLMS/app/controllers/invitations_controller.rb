class InvitationsController < ApplicationController
  before_action :verify_current_user_owns_classrooms, only: :create_coteacher_invitation
  before_action :set_classroom_ids_and_inviteee_email, only: :create_coteacher_invitation


  MAX_COTEACHER_INVITATIONS_PER_CLASS = 50
  MAX_COTEACHER_INVITATIONS_PER_TIME = 50
  MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS = 24

  def create_coteacher_invitation
    begin
      validate_email_and_classroom_ids
      validate_max_coteacher_invitations
      @pending_invite = find_or_create_coteacher_invite_from_current_user
      assign_classrooms_to_invitee
      invoke_email_worker
      return render json: { invite_id: @pending_invite.id }
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

  def validate_max_coteacher_invitations
    validate_available_classroom_id_invitations
    validate_available_user_id_invitations_today
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

  def validate_available_classroom_id_invitations
    # In order to avoid letting people use our platform to spam folks,
    # we want to put some limits on the number of invitations a user can issue.
    # One of those limits is a cap on invitations per classroom
    CoteacherClassroomInvitation.select(:classroom_id).where(classroom_id: @classroom_ids).group(:classroom_id).count(:classroom_id) do |key, value|
      if value >= MAX_COTEACHER_INVITATIONS_PER_CLASS
        raise StandardError.new("The maximum limit of #{MAX_COTEACHER_INVITATIONS_PER_CLASS} coteacher invitations have already been issued for class #{key}")
      end
    end
  end

  def validate_available_user_id_invitations_today
    # In order to avoid letting people use our platform to spam folks,
    # we want to put some limits on the number of invitations a user can issue.
    # One of those limits is a cap on invitations per user per time period
    recent_invitation_count = Invitation.where(inviter_id: current_user.id, created_at: MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS.hours.ago..Time.now).count()
    if recent_invitation_count >= MAX_COTEACHER_INVITATIONS_PER_TIME
      raise StandardError.new("User #{current_user.id} has reached the maximum of #{MAX_COTEACHER_INVITATIONS_PER_TIME} coteacher invitaitons that they can issue in a #{MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS} hour period")
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
        CoteacherClassroomInvitation.create(invitation_id: @pending_invite.id, classroom_id: id)
      end
    end
  end
end
