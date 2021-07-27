require 'rails_helper'

RSpec.describe 'Google Auth' do
  let(:email) { ENV.fetch('GOOGLE_TEST_USER_EMAIL') }
  let(:password) { ENV.fetch('GOOGLE_TEST_USER_PASSWORD') }
  let!(:user) { create(:user, role: 'teacher', email: email, password: password) }

  it 'user can login via google auth', :js do
    visit root_path
    click_link 'Log In'
    click_button 'Log in with Google'
    fill_in 'identifierId', with:  user.email
    click_button 'Next'
    fill_in 'password', with: user.password
    click_button 'Next'
    click_button 'Allow'
  end
end
