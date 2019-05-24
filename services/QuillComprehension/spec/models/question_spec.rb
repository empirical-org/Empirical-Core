require "rails_helper"

RSpec.describe Question, :type => :model do

  it "will give a question with no order an order before saving" do
    question = build(:question, order: nil)
    question.save
    expect(question.order).not_to be(nil)
  end

end
