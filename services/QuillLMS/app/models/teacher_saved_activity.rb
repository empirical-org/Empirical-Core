# == Schema Information
#
# Table name: teacher_saved_activities
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#  teacher_id  :integer          not null
#
# Indexes
#
#  index_teacher_saved_activities_on_activity_id                 (activity_id)
#  index_teacher_saved_activities_on_teacher_id                  (teacher_id)
#  index_teacher_saved_activities_on_teacher_id_and_activity_id  (teacher_id,activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (teacher_id => users.id)
#
class TeacherSavedActivity < ActiveRecord::Base
  belongs_to :activity
  belongs_to :teacher, class_name: "User"

  validates :activity_id, presence: true
  validates :teacher_id, presence: true
  validates :activity_id, uniqueness: { scope: :teacher_id }
end
