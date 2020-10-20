class TeacherSavedActivity < ActiveRecord::Base
  validates :activity_id, presence: true
  validates :teacher_id, presence: true
end
