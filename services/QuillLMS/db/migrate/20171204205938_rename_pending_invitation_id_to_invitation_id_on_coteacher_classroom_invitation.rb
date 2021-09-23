class RenamePendingInvitationIdToInvitationIdOnCoteacherClassroomInvitation < ActiveRecord::Migration[4.2]
  def change
    rename_column :coteacher_classroom_invitations, :pending_invitation_id, :invitation_id
  end
end
