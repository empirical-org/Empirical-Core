require 'rails_helper'

RSpec.describe Response, type: :model do
  let(:activity) { create(:activity, description: "Foobar.")}
  let(:question_set) { create(:question_set, activity: activity)}
  let(:question) { create(:question, question_set: question_set)}
  let(:response) { create(:response, question: question)}
  let(:correct_response_label) { create(:response_label)}
  let(:factual_response_label) { create(:response_label, name: "factual", description: "Is the answer factual?")}



  it 'has the correct relations' do
    expect(response.question).to be(question)
    expect(question.activity).to be(activity)
  end

  it "can calculate its metrics" do
    rlt = build(:response_label_tag, response_id: nil)
    expect(rlt.valid?).to be(false)
  end
end
