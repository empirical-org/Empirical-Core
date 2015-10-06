class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  belongs_to :author
  has_and_belongs_to_many :activities
  serialize :grades, Array

  def activity_ids= activity_ids
    self.activities = Activity.find(activity_ids)
  end
end
