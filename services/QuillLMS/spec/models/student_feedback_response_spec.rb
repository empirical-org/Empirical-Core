require 'rails_helper'

describe StudentFeedbackResponse do
  it {
    should validate_presence_of :question
    should validate_presence_of :response
    should validate_length_of(:response).is_at_most(1000)
  }
end
