class CoteacherClassroomInvitationsController < ApplicationController
  before_action :signed_in!

  def accept_pending_coteacher_invitations
    coteacher_invitations_to_accept = params[:coteacher_invitation_ids].map(&:to_i)
    classrooms = ActiveRecord::Base.connection.execute("
      SELECT coteacher_classroom_invitations.classroom_id, invitations.id AS invitation_id
      FROM coteacher_classroom_invitations
      INNER JOIN invitations
        ON invitations.invitation_type = '#{Invitation::TYPES[:coteacher]}'
        AND invitations.invitee_email = #{ActiveRecord::Base.sanitize(current_user.email)}
        AND invitations.archived = false
      WHERE coteacher_classroom_invitations.id IN (#{coteacher_invitations_to_accept.join(', ')})
    ").to_a
    classroom_ids = Set.new
    invitation_ids = Set.new
    classrooms.each do |classroom|
      classroom_ids << classroom['classroom_id'].to_i
      invitation_ids << classroom['invitation_id'].to_i
    end
    return auth_failed if classroom_ids.empty?
    classroom_ids.each do |classroom_id|
      ClassroomsTeacher.create(classroom_id: classroom_id, role: ClassroomsTeacher::ROLE_TYPES[:coteacher], user_id: current_user.id)
    end
    invitation_ids.each do |invitation_id|
      if !CoteacherClassroomInvitation.exists?(invitation_id: invitation_id)
        Invitation.find(invitation_id).update(archived: true)
      end
    end
    respond_to do |format|
      format.html { return redirect_to dashboard_teachers_classrooms_path }
      format.json { }
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
      format.json { }
    end
  end
end
