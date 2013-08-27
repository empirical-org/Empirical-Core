class RuleQuestionInput < ActiveRecord::Base
  belongs_to :rule_question

  def handle_input input
    if first_input.blank?
      self.first_input = input
    elsif second_input.blank?
      self.second_input = input
    else
      raise "Only supports inputting twice."
    end

    save!
  end

  def correct
    rule_question.answers.first
  end
end
