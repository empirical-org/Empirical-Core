require "rails_helper"

RSpec.describe Activity, :type => :model do
  
  it ".create" do
    activity = build(:activity, description: "Foobar.")
    expect(activity.valid?).to eq(true)
    expect(activity.title).to eq("Activity 1")
    expect(activity.description).to eq("Foobar.")
  end

  it 'has question sets' do
    activity = create(:activity, description: "Foobar.")
    question_set = create(:question_set, activity: activity)
    expect(activity.question_sets.first).to eq(question_set)

    qs2 = create(:question_set, activity: activity)
    expect(activity.question_sets.length).to eq(2)
  end

  it 'has questions via question_sets' do 
    activity = create(:activity, description: "Foobar.")
    question_set = create(:question_set, activity: activity)
    question = create(:question, question_set: question_set)
    expect(activity.questions.length).to eq(1)
  end

end