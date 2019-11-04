require 'rails_helper'

RSpec.describe VocabularyWord, type: :model do
  it "should belong to an activity" do
    activity = create(:activity)
    vocab_word = create(:vocabulary_word, activity: activity)
    expect(vocab_word.activity).to be(activity)
  end
end
