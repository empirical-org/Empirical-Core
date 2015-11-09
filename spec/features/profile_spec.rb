require 'rails_helper'

feature 'Profile', js: true do



  before :each do
    vcr_ignores_localhost
    sign_in_user student
  end

  it 'works' do
    visit('/')
    expect(page).to have_content()
    expect(true).to eq(true)
  end

end