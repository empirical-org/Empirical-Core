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

  def completed?
    completion_date.present?
  end

  def final_grade
    (score_values[:story_percentage] + score_values[:review_percentage]).to_f / 2
  end

  def finalize!
    self.score_values = ScoreFinalizer.new(self).results
    give_time
    save!
  end
end
