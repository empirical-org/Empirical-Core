require 'rails_helper'

RSpec.describe "vocabulary_words/show", type: :view do
  before(:each) do
    @vocabulary_word = assign(:vocabulary_word, VocabularyWord.create!(
      :activity => nil,
      :text => "MyText",
      :description => "MyText",
      :example => "MyText",
      :order => 2
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(//)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/2/)
  end
end
