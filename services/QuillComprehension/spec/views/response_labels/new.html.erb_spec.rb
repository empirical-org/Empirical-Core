require 'rails_helper'

RSpec.describe "response_labels/new", type: :view do
  before(:each) do
    assign(:response_label, ResponseLabel.new(
      :name => "MyText",
      :description => "MyText"
    ))
  end

  it "renders new response_label form" do
    render

    assert_select "form[action=?][method=?]", response_labels_path, "post" do

      assert_select "textarea[name=?]", "response_label[name]"

      assert_select "textarea[name=?]", "response_label[description]"
    end
  end
end
