class UnitTemplateUnit < ActiveRecord::Base
  # uniqueness constraint on unit_template for a given unit present in db
  belongs_to :unit
  belongs_to :unit_template
end
