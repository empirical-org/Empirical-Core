require 'rails_helper'

RSpec.describe "vocabulary_words/index", type: :view do
  before(:each) do
    assign(:vocabulary_words, [
      VocabularyWord.create!(
        :activity => nil,
        :text => "MyText",
        :description => "MyText",
        :example => "MyText",
        :order => 2
      ),
      VocabularyWord.create!(
        :activity => nil,
        :text => "MyText",
        :description => "MyText",
        :example => "MyText",
        :order => 2
      )
    ])
  end

  it "renders a list of vocabulary_words" do
    render
    assert_select "tr>td", :text => nil.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
  end
end
