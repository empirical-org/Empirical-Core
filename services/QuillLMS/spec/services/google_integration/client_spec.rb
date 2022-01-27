# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::Client do
  it 'returns an initialized google api client' do
    user                = create(:user)
    access_token        = 'coolio'
    api_client          = double('api_client')
    api_client_instance = double('api_client_instance')
    token_refresher     = double('token_refresher')
    auth_credential     = create(:google_auth_credential,
      user: user,
      access_token: access_token
    )

    expect(api_client)
      .to receive_message_chain(:new).with(
        application_name: 'quill',
        user_agent: "quill/0.0.0 google-api-ruby-client/1.2.3 Linux/4.4.0-130-generic (gzip)")
      .and_return(api_client_instance)

    expect(token_refresher).to receive_message_chain(:new, :refresh)
      .and_return(auth_credential)

    expect(api_client_instance)
      .to receive_message_chain(:authorization, :access_token=)
      .with(access_token)

    GoogleIntegration::Client
      .new(user, api_client, token_refresher, '1.2.3', 'Linux/4.4.0-130-generic')
      .create
  end

  it 'checks if access token needs to be refreshed' do
    user                     = create(:user)
    access_token             = 'coolio'
    token_refresher          = double('token_refresher')
    token_refresher_instance = spy('token_refresher_instance')
    auth_credential          = create(:google_auth_credential,
      user: user,
      access_token: access_token
    )

    expect(token_refresher).to receive(:new).with(user)
      .and_return(token_refresher_instance)

    GoogleIntegration::Client.new(user, nil, token_refresher).create

    expect(token_refresher_instance).to receive(:refresh)
  end
end
