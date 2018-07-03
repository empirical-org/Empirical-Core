require 'rails_helper'

RSpec.describe Response, type: :model do
  let(:activity) { create(:activity, description: "Foobar.")}
  let(:question_set) { create(:question_set, activity: activity)}
  let(:question) { create(:question, question_set: question_set)}
  let(:response) { create(:response, question: question)}
  let(:correct_response_label) { create(:response_label)}
  let(:factual_response_label) { create(:response_label, name: "factual", description: "Is the answer factual?")}
  let(:spelling_response_label) { create(:response_label, name: "spelling", description: "Is the answer spelled correctly?")}


  it 'has the correct relations' do
    expect(response.question).to be(question)
    expect(question.activity).to be(activity)
  end

  it "can calculate one of it metrics" do
    rlt1 = create(:response_label_tag, response: response, response_label: correct_response_label)
    expect(response.metric("correct")).to eq(1)
    rlt2 = create(:response_label_tag, response: response, response_label: correct_response_label, score: -1)
    expect(response.metric("correct")).to eq(0)
  end

  it "can calculate one of it metrics 2" do
    rlt2 = create(:response_label_tag, response: response, response_label: correct_response_label, score: -1)
    expect(response.metric("correct")).to eq(-1)
  end

  it "can calculate all of its metrics" do
    rlt1 = create(:response_label_tag, response: response, response_label: correct_response_label)
    expect(response.metrics).to eq({
      "correct": 1,
    })
  end

  it "can calculate all of its metrics with multiple tags" do
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    expect(response.metrics).to eq({
      "correct": 2,
      "factual": -2
    })
  end

  it "can calculate all of its metrics with multiple tags" do
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: spelling_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: spelling_response_label)
    create(:response_label_tag, response: response, response_label: spelling_response_label, score: -1)
    expect(response.metrics).to eq({
      "correct": 2,
      "factual": -2,
      "spelling": -1
    })
  end

  it "can access all of its tags including metrics" do
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: factual_response_label)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label, name: "spelling", description: "Is the answer spelled correctly?")
    expect(response.all_metrics).to eq({
      "correct": 3,
      "factual": 0,
      "spelling": 0
    })
  end

  it "can calculate its latest metrics with multiple tags" do
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: correct_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    create(:response_label_tag, response: response, response_label: factual_response_label)
    expect(response.latest_metrics).to eq({
      "correct": -1,
      "factual": 1
    })
  end

  it "can reset its tags for a response label" do
    create(:response_label_tag, response: response, response_label: correct_response_label)
    create(:response_label_tag, response: response, response_label: factual_response_label, score: -1)
    response.reset_metric("correct")
    expect(response.all_metrics).to eq({
      "correct": 0,
      "factual": -1
    })
  end

end
