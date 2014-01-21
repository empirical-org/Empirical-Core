require 'spec_helper'

describe 'not found page' do
  it 'should respond with 500 page' do
    visit '/foo'
    page.should have_content('500')
  end
end

