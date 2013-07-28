class Score < ActiveRecord::Base
  belongs_to :assignment
  belongs_to :user
  serialize :lesson_input, Hash

  def give_time
  	self.completion_date = Time.now
  end
end
