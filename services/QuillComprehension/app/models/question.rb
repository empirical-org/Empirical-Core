class Question < ApplicationRecord
  belongs_to :question_set
  delegate :activity, :to => :question_set, :allow_nil => true
  has_many :responses

  before_save :set_order, if: proc {|q| q.order.nil?}

  def set_order
    sibling_questions = question_set&.questions
    if sibling_questions.any?
      last_sibling_question = sibling_questions.sort { |q| q.order }.last
      self.order = last_sibling_question.order + 1
    else
      self.order = 0
    end
  end
end
