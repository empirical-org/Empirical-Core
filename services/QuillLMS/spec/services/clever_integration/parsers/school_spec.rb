require 'rails_helper'

describe 'CleverIntegration::Parsers::School' do

  let!(:response) {
    school = Clever::School.new({nces_id: 'school1', id: 'clever1'})
    Clever::SchoolResponse.new({ data: school })
  }

  let!(:expected) {
    {nces_id: 'school1',
     id: 'clever1'}
  }

  def subject
    CleverIntegration::Parsers::School.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end
