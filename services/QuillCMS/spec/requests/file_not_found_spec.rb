require 'rails_helper'

describe 'Missing files', type: :request do

  it 'should return a 404' do
    get '/file_does_not_exist.png'

    expect(response.status).to eq 404
  end
end
