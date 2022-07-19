# frozen_string_literal: true

# == Schema Information
#
# Table name: coteacher_classroom_invitations
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  classroom_id  :integer          not null
#  invitation_id :integer          not null
#
# Indexes
#
#  classroom_invitee_index                                 (invitation_id,classroom_id) UNIQUE
#  index_coteacher_classroom_invitations_on_classroom_id   (classroom_id)
#  index_coteacher_classroom_invitations_on_invitation_id  (invitation_id)
#
class CoteacherClassroomInvitation < ApplicationRecord
  belongs_to :invitation
  belongs_to :classroom

  validate :validate_invitation_limit
  before_save   :prevent_saving_if_classrooms_teacher_association_exists
  after_save    :trigger_analytics
  after_destroy :update_parent_invitation

  MAX_COTEACHER_INVITATIONS_PER_CLASS = 50

  private def update_parent_invitation
    return if CoteacherClassroomInvitation.exists?(invitation_id: invitation_id)

    Invitation.find(invitation_id).update(archived: true)
  end

  private def prevent_saving_if_classrooms_teacher_association_exists
    classrooms_teachers = RawSqlRunner.execute(
      <<-SQL
        SELECT 1
        FROM invitations
        JOIN users
          ON invitations.invitee_email = users.email
        JOIN classrooms_teachers
          ON classrooms_teachers.classroom_id = #{classroom_id}
          AND classrooms_teachers.user_id = users.id
        WHERE invitations.id = #{invitation_id};
      SQL
    ).to_a

    throw(:abort) if classrooms_teachers.any?
  end

  private def trigger_analytics
    invitation = self.invitation
    UserMilestone.find_or_create_by(user_id: invitation.inviter_id, milestone_id: Milestone.find_or_create_by(name: Milestone::TYPES[:invite_a_coteacher]).id)
    Analyzer.new.track_with_attributes(
        User.find(invitation.inviter_id),
        SegmentIo::BackgroundEvents::COTEACHER_INVITATION,
        { properties: { invitee_email: invitation.invitee_email } }
    )
  end

  private def validate_invitation_limit
    # In order to avoid letting people use our platform to spam folks,
    # we want to put some limits on the number of invitations a user can issue.
    # One of those limits is a cap on invitations per classroom
    current_count = CoteacherClassroomInvitation.unscoped.where(classroom_id: classroom_id).count
    return if current_count < MAX_COTEACHER_INVITATIONS_PER_CLASS

    errors.add(:base, "The maximum limit of #{MAX_COTEACHER_INVITATIONS_PER_CLASS} coteacher invitations have already been issued for class #{classroom_id}")
  end

end
