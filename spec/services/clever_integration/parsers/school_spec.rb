require 'rails_helper'

describe 'CleverIntegration::Parsers::School' do

  let!(:response) {
    {name: 'school1'}
  }

  let!(:expected) {
    {name: 'school1'}
  }

  def subject
    CleverIntegration::Parsers::School.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end