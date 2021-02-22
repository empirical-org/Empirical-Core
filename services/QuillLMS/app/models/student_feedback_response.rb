class StudentFeedbackResponse < ActiveRecord::Base
  validates_presence_of :question, :response
  validates :response, length: { maximum: 1000 }
end
