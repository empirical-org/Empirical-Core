class CoteacherClassroomInvitationsController < ApplicationController

  def accept_pending_coteacher_invitations
    coteacher_invitations_to_accept = params[:coteacher_invitation_ids]
    classroom_ids = ActiveRecord::Base.connection.execute("
      SELECT coteacher_classroom_invitations.classroom_id
      FROM coteacher_classroom_invitations
      INNER JOIN pending_invitations
        ON pending_invitations.invitation_type = '#{PendingInvitation::TYPES[:coteacher]}'
        AND pending_invitations.invitee_email = '#{current_user.email}'
      WHERE coteacher_classroom_invitations.id IN (#{coteacher_invitations_to_accept.join(', ')})
    ").to_a.map{|classroom|classroom['classroom_id'].to_i}
    auth_failed if classroom_ids.empty?
    classroom_ids.each do |classroom_id|
      ClassroomsTeacher.create(classroom_id: classroom_id, role: 'coteacher', user_id: current_user.id)
    end
    respond_to do |format|
      format.html { return redirect_to dashboard_teachers_classrooms_path }
      format.json {  }
    end
  end

  # def withdraw_pending_coteacher_invitations
  #
  #   delete_pending_coteacher_invitations
  # end
  #
  # def reject_pending_coteacher_invitations
  #
  #   delete_pending_coteacher_invitations
  # end

  # private
  # def delete_pending_coteacher_invitations
  #   pending_invitation = PendingInvitation.find_by(invitee_email: current
  #
  # end

end
