# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User login' do
  let!(:user) { create(:teacher) }

  it 'can be completed within a valid email and password', :js, retry: 3 do
    visit root_path
    click_link 'Log In'
    fill_in 'email-or-username', with: user.email
    fill_in 'password', with: user.password
    click_on 'log-in'
    click_button "Let's go!"
    expect(page).to have_current_path '/teachers/classrooms/dashboard'
  end
end
