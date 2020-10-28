require 'rails_helper'

describe "user_mailer/ell_starter_diagnostic_info_email.html.erb", type: :view do
  it "should render the email" do
    assign(:name, "Eric")

    render

    rendered.should match("Eric")
  end
end
