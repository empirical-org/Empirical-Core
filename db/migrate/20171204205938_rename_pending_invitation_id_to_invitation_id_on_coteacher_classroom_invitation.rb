class RenamePendingInvitationIdToInvitationIdOnCoteacherClassroomInvitation < ActiveRecord::Migration
  def change
    rename_column :coteacher_classroom_invitations, :pending_invitation_id, :invitation_id
  end
end
