class CoteacherClassroomInvitation < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :classroom
end
