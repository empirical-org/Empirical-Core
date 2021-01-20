class TeacherSavedActivity < ActiveRecord::Base
  belongs_to :activity
  belongs_to :teacher, class_name: "User"

  validates :activity_id, presence: true
  validates :teacher_id, presence: true
  validates :activity_id, uniqueness: { scope: :teacher_id }
end
