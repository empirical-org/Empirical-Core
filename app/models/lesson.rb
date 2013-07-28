class Lesson < ActiveRecord::Base
  belongs_to :rule
  serialize :body

  def answers
    body
  end

  def answer_array_json
    body.to_json
  end

  def answer_array_text
    return "" if body.nil?
    body.join(", ")
  end

  def answer_array_text= string
    self.body = string.split(",").map(&:strip)
  end
end
