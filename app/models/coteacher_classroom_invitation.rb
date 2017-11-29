class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :pending_invitation
  belongs_to :classroom
end
