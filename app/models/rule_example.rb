class RuleExample < ActiveRecord::Base
  def correct_string= correct_string
    self[:correct] = true if correct_string == 'correct'
  end

  def correct_string
    self[:correct] ? 'correct' : 'incorrect'
  end
end
