require 'rails_helper'

RSpec.describe "response_labels/show", type: :view do
  before(:each) do
    @response_label = assign(:response_label, ResponseLabel.create!(
      :name => "MyText",
      :description => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
  end
end
