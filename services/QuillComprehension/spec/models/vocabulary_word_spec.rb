require 'rails_helper'

RSpec.describe VocabularyWord, type: :model do
  it "should belong to an activity" do
    activity = create(:activity)
    vocabWord = create(:vocabulary_word, activity: activity)
    expect(vocabWord.activity).to be(activity)
  end
end
