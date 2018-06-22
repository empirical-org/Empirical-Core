require 'rails_helper'

RSpec.describe "response_labels/index", type: :view do
  before(:each) do
    assign(:response_labels, [
      ResponseLabel.create!(
        :name => "MyText",
        :description => "MyText"
      ),
      ResponseLabel.create!(
        :name => "MyText",
        :description => "MyText"
      )
    ])
  end

  it "renders a list of response_labels" do
    render
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
