require 'rails_helper'

describe "pages/careers.html.erb", type: :view do
  include_context 'routing url helpers'

  it "displays all the widgets" do
    assign(:root_url, root_url)
    assign(:open_positions, PagesController::OPEN_POSITIONS)

    render

    expect(rendered).to match("Our mission")
  end
end
