class ActivityCategory < ActiveRecord::Base
  has_many :activity_category_activities
  has_many :activities, through: :activity_category_activities
end
