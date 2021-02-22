# == Schema Information
#
# Table name: student_feedback_responses
#
#  id           :integer          not null, primary key
#  grade_levels :string           default([]), is an Array
#  question     :text             default("")
#  response     :text             default("")
#  created_at   :datetime
#  updated_at   :datetime
#
class StudentFeedbackResponse < ActiveRecord::Base
  validates_presence_of :question, :response
  validates :response, length: { maximum: 1000 }
end
