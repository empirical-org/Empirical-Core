class RuleQuestionInput < ActiveRecord::Base
  belongs_to :rule_question

  def handle_input input
    if first_input.nil?
      self.first_input = input
    elsif second_input.nil?
      self.second_input = input
    else
      raise "Only supports inputting twice."
    end

    save!
  end

  def correct
    rule_question.answers.first
  end

  def first_grade
    return nil if first_input.nil?
    rule_question.answers.map{ |a| a.strip == first_input.strip }.compact.any?
  end

  def second_grade
    return nil if second_input.nil?
    rule_question.answers.map{ |a| a.strip == second_input.strip }.compact.any?
  end
end
