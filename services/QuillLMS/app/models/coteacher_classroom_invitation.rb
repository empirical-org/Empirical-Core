class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :classroom

  before_save   :prevent_saving_if_classrooms_teacher_association_exists, :validate_invitation_limit
  after_save    :trigger_analytics
  after_destroy :update_parent_invitation

  MAX_COTEACHER_INVITATIONS_PER_CLASS = 50

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
    UserMilestone.find_or_create_by(user_id: invitation.inviter_id, milestone_id: Milestone.find_or_create_by(name: Milestone::TYPES[:invite_a_coteacher]).id)
    Analyzer.new.track_with_attributes(
        User.find(invitation.inviter_id),
        SegmentIo::BackgroundEvents::COTEACHER_INVITATION,
        { properties: { invitee_email: invitation.invitee_email } }
    )
  end

  def validate_invitation_limit
    # In order to avoid letting people use our platform to spam folks,
    # we want to put some limits on the number of invitations a user can issue.
    # One of those limits is a cap on invitations per classroom
    CoteacherClassroomInvitation.select(:classroom_id).where(classroom_id: self.classroom_id).group(:classroom_id).count(:classroom_id) do |key, value|
      if value <= MAX_COTEACHER_INVITATIONS_PER_CLASS
        raise StandardError.new("The maximum limit of #{MAX_COTEACHER_INVITATIONS_PER_CLASS} coteacher invitations have already been issued for class #{key}")
      end
    end
  end

end
