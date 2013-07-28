class Score < ActiveRecord::Base
  belongs_to :assignment
  belongs_to :user

  def give_time
  	self.completion_date = Time.now
  end
end
