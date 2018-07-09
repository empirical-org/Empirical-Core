class UnitActivity < ActiveRecord::Base
  belongs_to :unit
  belongs_to :activity
  has_many :classroom_unit_activity_states
end
