# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::Client do
  let!(:auth_credential) { create(:google_auth_credential, access_token: access_token) }
  let(:user) { auth_credential.user }
  let(:access_token) { 'coolio' }
  let(:token_refresher) { double('token_refresher') }

  context 'token refreshing with api client' do
    let(:api_client) { double('api_client') }
    let(:api_client_instance) { double('api_client_instance') }
    let(:api_version)  { '1.2.3' }
    let(:application_name) { 'quill' }
    let(:os_version) { 'Linux/4.4.0-130-generic' }
    let(:user_agent) { "#{application_name}/0.0.0 google-api-ruby-client/#{api_version} #{os_version} (gzip)" }

    it 'returns an initialized google api client' do
      expect(api_client)
        .to receive(:new)
        .with(application_name: application_name, user_agent: user_agent)
        .and_return(api_client_instance)

      expect(token_refresher).to receive_message_chain(:new, :refresh).and_return(auth_credential)
      expect(api_client_instance).to receive_message_chain(:authorization, :access_token=).with(access_token)

      GoogleIntegration::Client
        .new(user, api_client, token_refresher, api_version, os_version)
        .create
    end
  end

  context 'token refreshing without api client' do
    let(:token_refresher_instance) { spy('token_refresher_instance') }

    it 'checks if access token needs to be refreshed' do
      expect(token_refresher).to receive(:new).with(user).and_return(token_refresher_instance)
      expect(token_refresher_instance).to receive(:refresh)

      GoogleIntegration::Client.new(user, nil, token_refresher).create
    end
  end
end
