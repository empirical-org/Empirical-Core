require 'rails_helper'

describe 'CleverIntegration::Parsers::DistrictFromAuth' do

  let!(:response) {
    {
      info: {
        id: '1',
        name: 'district1',
      },
      credentials: {token: 'token1'}
    }
  }

  let!(:expected) {
    {
     clever_id: '1',
     name: 'district1',
     token: 'token1'
    }
  }

  def subject
    CleverIntegration::Parsers::DistrictFromAuth.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end