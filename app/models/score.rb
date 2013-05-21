class Score < ActiveRecord::Base
  attr_accessible :assignment_id, :completion_date, :items_missed, :lessons_completed, :user_id
  belongs_to :assignment
  belongs_to :user

  def give_time
  	self.completion_date = Time.now
  end
end
