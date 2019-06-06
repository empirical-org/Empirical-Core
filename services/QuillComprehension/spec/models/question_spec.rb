require "rails_helper"

RSpec.describe Question, :type => :model do

  it "will give a question with no order an order before saving" do
    question = build(:question, order: nil)
    question.save
    expect(question.order).not_to be(nil)
  end

  it "will set the order of a question to be the last one in the question set + 1" do
    question_set = create(:question_set)
    question1 = create(:question, order: nil, question_set: question_set)
    question2 = create(:question, order: nil, question_set: question_set)
    expect(question1.order).to be(0)
    expect(question2.order).to be(1)
  end

end
