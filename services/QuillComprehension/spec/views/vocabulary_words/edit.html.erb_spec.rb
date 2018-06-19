require 'rails_helper'

RSpec.describe "vocabulary_words/edit", type: :view do
  before(:each) do
    @vocabulary_word = assign(:vocabulary_word, VocabularyWord.create!(
      :activity => nil,
      :text => "MyText",
      :description => "MyText",
      :example => "MyText",
      :order => 1
    ))
  end

  it "renders the edit vocabulary_word form" do
    render

    assert_select "form[action=?][method=?]", vocabulary_word_path(@vocabulary_word), "post" do

      assert_select "input[name=?]", "vocabulary_word[activity_id]"

      assert_select "textarea[name=?]", "vocabulary_word[text]"

      assert_select "textarea[name=?]", "vocabulary_word[description]"

      assert_select "textarea[name=?]", "vocabulary_word[example]"

      assert_select "input[name=?]", "vocabulary_word[order]"
    end
  end
end
