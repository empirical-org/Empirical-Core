# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StaticController, type: :controller do

  it 'should send the manifest.json file' do
    get :manifest

    expect(response.header['Content-Type']).to eq 'application/json'
    expect(response.header['Content-Disposition']).to include 'inline'
    expect(response.body).to eq File.read(Rails.root.join('config/manifest.json'))
  end
end
