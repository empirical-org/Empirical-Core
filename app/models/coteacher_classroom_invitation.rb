class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :classroom

  after_commit :update_parent_invitation, on: :destroy

  private
  def update_parent_invitation
    invitations = CoteacherClassroomInvitation.where(invitation_id: previous_changes[:invitation_id])
    unless invitations.any?
      Invitation.find(parent_invitation_id).update(archived: true)
    end
  end
end
