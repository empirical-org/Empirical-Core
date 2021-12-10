# frozen_string_literal: true

require 'rails_helper'

describe 'Missing files', type: :request do

  it 'should return a 404' do
    get '/file_does_not_exist.php'

    expect(response.status).to eq 404
  end
end
