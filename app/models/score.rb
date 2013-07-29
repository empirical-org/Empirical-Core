class Score < ActiveRecord::Base
  belongs_to :assignment
  belongs_to :user
  serialize :practice_lesson_input, Hash
  serialize :review_lesson_input, Hash
  serialize :missed_rules, Array
  serialize :score_values, Hash

  def missed_rules
    Rule.where(id: super)
  end

  def give_time
  	self.completion_date = Time.now
  end

  def finalize!
    self.score_values = ScoreFinalizer.new(self).results
    save!
  end
end
