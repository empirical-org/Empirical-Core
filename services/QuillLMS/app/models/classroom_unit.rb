class ClassroomUnit < ActiveRecord::Base
  belongs_to :unit
  belongs_to :classroom
  has_many :classroom_unit_activity_states
end
