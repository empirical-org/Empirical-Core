class ActivitiesUnitTemplate < ActiveRecord::Base
  belongs_to :unit_template
  belongs_to :activity
end