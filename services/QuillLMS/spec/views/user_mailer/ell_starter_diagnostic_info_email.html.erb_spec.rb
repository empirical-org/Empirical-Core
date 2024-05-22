# frozen_string_literal: true

require 'rails_helper'

describe "user_mailer/ell_starter_diagnostic_info_email.html.erb", type: :view do
  it "should render the email" do
    allow(view).to receive(:vite_stylesheet_tag)
    assign(:name, "Eric")
    assign(:constants, UserMailer::CONSTANTS)

    render template: 'user_mailer/ell_starter_diagnostic_info_email'

    expect(rendered).to match("Eric")
  end
end
