# frozen_string_literal: true

class CoteacherClassroomInvitationsController < ApplicationController
  before_action :signed_in!

  def accept_pending_coteacher_invitations
    coteacher_invitations_to_accept = params[:coteacher_invitation_ids].map(&:to_i)
    invitations = RawSqlRunner.execute(
      <<-SQL
        SELECT
          coteacher_classroom_invitations.classroom_id,
          invitations.id AS invitation_id
        FROM coteacher_classroom_invitations
        JOIN invitations
          ON invitations.invitation_type = '#{Invitation::TYPES[:coteacher]}'
          AND invitations.invitee_email = #{ActiveRecord::Base.connection.quote(current_user.email)}
          AND invitations.archived = false
        WHERE coteacher_classroom_invitations.id IN (#{coteacher_invitations_to_accept.join(', ')})
      SQL
    ).to_a

    return auth_failed if invitations.empty?

    invitations.each do |invitation|
      ClassroomsTeacher.create(classroom_id: invitation['classroom_id'], role: ClassroomsTeacher::ROLE_TYPES[:coteacher], user_id: current_user.id)
      CoteacherClassroomInvitation.find_by(classroom_id: invitation['classroom_id'], invitation_id: invitation['invitation_id'])&.destroy
      Analyzer.new.track(current_user, SegmentIo::BackgroundEvents::COTEACHER_ACCEPTANCE)
    end

    respond_to do |format|
      format.html { return redirect_to dashboard_teachers_classrooms_path }
      format.json { render json: {}, status: 200 }
    end
  end

  def reject_pending_coteacher_invitations
    params[:coteacher_invitation_ids].each do |coteacher_invitation_id|
      coteacher_invitation = CoteacherClassroomInvitation.find(coteacher_invitation_id)
      return auth_failed unless coteacher_invitation.invitation.invitee_email == current_user.email

      coteacher_invitation.destroy
    end
    respond_to do |format|
      format.html { return redirect_to dashboard_teachers_classrooms_path }
      format.json { render json: {}, status: 200 }
    end
  end

  def destroy
    coteacher_invitation = CoteacherClassroomInvitation.find(params[:id])
    if coteacher_invitation.classroom.owner == current_user
      coteacher_invitation.destroy
      render json: {}
    else
      render json: {}, status: 403
    end
  end
end
