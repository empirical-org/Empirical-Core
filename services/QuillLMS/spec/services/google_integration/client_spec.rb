require 'rails_helper'

describe GoogleIntegration::Client do
  it 'returns an initialized google api client' do
    access_token    = 'coolio'
    api_client      = double('api_client')
    token_refresher = double('token_refresher')

    expect(api_client)
      .to receive_message_chain(:new, :authorization, :access_token=)
      .with(access_token)

    expect(token_refresher).to receive_message_chain(:new, :refresh)
      .and_return(access_token)

    GoogleIntegration::Client.new(access_token, api_client, token_refresher)
      .create
  end

  it 'checks if access token needs to be refreshed' do
    access_token    = 'coolio'
    token_refresher = double('token_refresher')

    expect(token_refresher).to receive_message_chain(:new, :refresh)

    GoogleIntegration::Client.new(access_token, nil, token_refresher).create
  end
end
