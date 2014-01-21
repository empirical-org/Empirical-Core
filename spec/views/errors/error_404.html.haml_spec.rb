require 'spec_helper'

describe 'not found page' do
  it 'should respond with 404 page' do
    visit '/foo'
    page.should have_content('404')
  end
end

