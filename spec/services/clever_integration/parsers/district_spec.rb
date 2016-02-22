require 'rails_helper'

describe 'CleverIntegration::Parsers::District' do


    {
      clever_id: auth_hash[:info][:id],
      name: auth_hash[:info][:name],
      token: auth_hash[:credentials][:token]
    }


  let!(:response) {
    {
      info: {
        id: '1',
        name: 'district1',
        token: 'token1'
      }
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
    CleverIntegration::Parsers::District.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end