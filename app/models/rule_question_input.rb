module FinalChapterView
  def correct
    rule_question.answers.first
  end

  def prompt
    rule_question.prompt
  end

  def first_grade
    return nil if first_input.nil?
    rule_question.answers.map{ |a| a.strip == first_input.strip }.compact.any?
  end

  def second_grade
    return nil if second_input.nil?
    rule_question.answers.map{ |a| a.strip == second_input.strip }.compact.any?
  end

  def missed?
    !(first_grade || second_grade)
  end

  def first_input_html
    first_input.present? ? first_input : '(blank)'
  end

  def second_input_html
    second_input.present? ? second_input : '(blank)'
  end

  def first_grade_class
    first_grade ? 'correct' : 'incorrect'
  end

  def second_grade_class
    return nil if first_grade
    second_grade ? 'correct' : 'incorrect'
  end

  def score
    return 1.0 if first_grade
    return 0.5 if second_grade
    0.0
  end
end

class RuleQuestionInput < ActiveRecord::Base
  include FinalChapterView
  belongs_to :rule_question
  has_one :rule, through: :rule_question
  belongs_to :activity_enrollment

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
end
