require 'rails_helper'

RSpec.describe "vocabulary_words/new", type: :view do
  before(:each) do
    assign(:vocabulary_word, VocabularyWord.new(
      :activity => nil,
      :text => "MyText",
      :description => "MyText",
      :example => "MyText",
      :order => 1
    ))
  end

  it "renders new vocabulary_word form" do
    render

    assert_select "form[action=?][method=?]", vocabulary_words_path, "post" do

      assert_select "input[name=?]", "vocabulary_word[activity_id]"

      assert_select "textarea[name=?]", "vocabulary_word[text]"

      assert_select "textarea[name=?]", "vocabulary_word[description]"

      assert_select "textarea[name=?]", "vocabulary_word[example]"

      assert_select "input[name=?]", "vocabulary_word[order]"
    end
  end
end
