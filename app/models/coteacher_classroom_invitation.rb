class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :classroom

  before_save   :prevent_saving_if_classrooms_teacher_association_exists
  after_save    :trigger_analytics
  after_destroy :update_parent_invitation

  private
  def update_parent_invitation
    unless CoteacherClassroomInvitation.exists?(invitation_id: self.invitation_id)
      Invitation.find(self.invitation_id).update(archived: true)
    end
  end

  def prevent_saving_if_classrooms_teacher_association_exists
    classrooms_teachers = ActiveRecord::Base.connection.execute("
      SELECT 1
      FROM invitations
      JOIN users
        ON invitations.invitee_email = users.email
      JOIN classrooms_teachers
        ON classrooms_teachers.classroom_id = #{self.classroom_id}
        AND classrooms_teachers.user_id = users.id
      WHERE invitations.id = #{self.invitation_id};
    ").to_a
    return false if classrooms_teachers.any?
  end

  def trigger_analytics
    invitation = self.invitation
    UserMilestone.create(user_id: invitation.inviter_id, milestone: Milestone.find_by_name(Milestone::TYPES[:invite_a_coteacher]))
    CoteacherAnalytics.new.track_coteacher_invitation(invitation.inviter_id, invitation.invitee_email)
  end
end
