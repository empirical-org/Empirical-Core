class UserMilestone < ActiveRecord::Base
  belongs_to :user
  belongs_to :milestone
end
