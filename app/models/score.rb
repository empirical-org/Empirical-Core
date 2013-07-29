class Score < ActiveRecord::Base
  belongs_to :assignment
  belongs_to :user
  serialize :lesson_input, Hash
  serialize :missed_rules, Array

  def give_time
  	self.completion_date = Time.now
  end
end
