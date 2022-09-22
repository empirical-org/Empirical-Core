# frozen_string_literal: true

module AuthenticationHelper
  def login_user(email_or_username, password)
    visit root_path
    click_link 'Log In'
    fill_in 'email-or-username', with: email_or_username
    fill_in 'password', with: password
    click_on 'Log in'
  end

  def logout_user(user)
    find('span', text: user.name).click
    click_on 'Logout'
  end
end
