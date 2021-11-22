# frozen_string_literal: true

require 'rails_helper'

describe "user_mailer/ell_starter_diagnostic_info_email.html.erb", type: :view do
  it "should render the email" do
    allow(view).to receive(:stylesheet_link_tag)
    assign(:name, "Eric")
    assign(:constants, UserMailer::CONSTANTS)

    render

    expect(rendered).to match("Eric")
  end
end
