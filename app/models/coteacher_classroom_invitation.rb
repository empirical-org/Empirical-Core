class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :classroom

  after_destroy :update_parent_invitation

  private
  def update_parent_invitation
    unless CoteacherClassroomInvitation.exists?(invitation_id: self.invitation_id)
      Invitation.find(self.invitation_id).update(archived: true)
    end
  end
end
