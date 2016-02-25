require 'rails_helper'

describe 'CleverIntegration::Parsers::Teacher' do

  let!(:response) {
    {
      id: '1',
      name: {first: 'john', last: 'smith'},
      email: 'teacher@gmail.com',
      district: 'district_id_1'
    }
  }

  let!(:expected) {
    {
      clever_id: '1',
      email: 'teacher@gmail.com',
      name: 'John Smith',
      district_id: 'district_id_1'
    }
  }

  def subject
    CleverIntegration::Parsers::Teacher.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end