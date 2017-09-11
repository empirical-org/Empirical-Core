class ActivityCategoryActivity < ActiveRecord::Base
  belongs_to :activity_category
  belongs_to :activity
  
end
