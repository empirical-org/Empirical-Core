require 'rails_helper'

RSpec.describe "response_labels/edit", type: :view do
  before(:each) do
    @response_label = assign(:response_label, ResponseLabel.create!(
      :name => "MyText",
      :description => "MyText"
    ))
  end

  it "renders the edit response_label form" do
    render

    assert_select "form[action=?][method=?]", response_label_path(@response_label), "post" do

      assert_select "textarea[name=?]", "response_label[name]"

      assert_select "textarea[name=?]", "response_label[description]"
    end
  end
end
