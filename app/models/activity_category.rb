class ActivityCategory < ActiveRecord::Base
  has_many :activity_category_activities
  has_many :activities, through: :activity_category_activities

  before_create :set_order_number

  def set_order_number
    if !self.order_number
      self.update(order_number: ActivityCategory.count)
    end
  end
end
