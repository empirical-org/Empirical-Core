class ClassroomActivity < ActiveRecord::Base
  has_many :activity_sessions
  belongs_to :activity
end
