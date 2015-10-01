class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  has_and_belongs_to_many :activities
end
