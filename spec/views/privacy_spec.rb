require 'spec_helper'
require 'capybara/rspec'
require 'capybara/rails'

describe 'privacy' do
  it 'opens privacy policy page' do
    visit '/privacy'
    page.should have_content('Privacy Policy')
  end
end