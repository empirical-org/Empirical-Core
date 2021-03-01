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
require 'rails_helper'

describe StudentFeedbackResponse do
  it {
    should validate_presence_of :question
    should validate_presence_of :response
    should validate_length_of(:response).is_at_most(1000)
  }
end
