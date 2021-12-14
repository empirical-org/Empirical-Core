require 'rails_helper'

describe 'Missing files', type: :request do

  it 'should return a 404 for non-existent asset' do
    get '/file_does_not_exist.png'

    expect(response.status).to eq 404
  end

  it 'should return a 404 for a post to root' do
    post '/'

    expect(response.status).to eq 404
  end

  it 'should return a 404 for a post to random endpoint' do
    post '/hello'

    expect(response.status).to eq 404
  end
end
