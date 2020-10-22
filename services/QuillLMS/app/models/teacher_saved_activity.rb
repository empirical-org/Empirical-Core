class TeacherSavedActivity < ActiveRecord::Base
  belongs_to :activity
  belongs_to :teacher, class_name: "User"

  validates :activity_id, presence: true
  validates :teacher_id, presence: true
end
