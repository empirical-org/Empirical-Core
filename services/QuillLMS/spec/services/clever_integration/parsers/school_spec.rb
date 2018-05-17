require 'rails_helper'

describe 'CleverIntegration::Parsers::School' do

  let!(:response) {
    {nces_id: 'school1'}
  }

  let!(:expected) {
    {nces_id: 'school1'}
  }

  def subject
    CleverIntegration::Parsers::School.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end
