class Checkbox < ActiveRecord::Base
  belongs_to :objective
  belongs_to :user

  validates :objective_id, uniqueness: { scope: :user_id, message: "should only be checked once per user" }


  def self.find_or_create_checkbox(name, user, flag=nil)
    if (Objective.find_by_name(name) && user)
      self.find_or_create_by(user_id: user.id, objective_id: Objective.find_by_name(name).id)
      CheckboxAnalyticsWorker.perform_async(user.id, name) unless flag
    end
  end


end
