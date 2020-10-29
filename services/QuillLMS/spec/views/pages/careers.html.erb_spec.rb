require 'rails_helper'

describe "pages/careers.html.erb", type: :view do
  it "displays all the widgets" do
    assign(:open_positions, PagesController::OPEN_POSITIONS)

    render

    rendered.should match("Our mission")
  end
end
