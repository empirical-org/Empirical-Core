# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::RefreshAccessToken do
  let(:user) { create(:user) }
  let!(:auth_credential) { create(:google_auth_credential, user: user) }

  let(:current_time) { Time.current }

  before { Timecop.freeze(current_time) }

  after { Timecop.return }

  subject { described_class.new(user) }

  describe '#refresh' do
    it 'returns current_credentials if should_refresh? is false' do
      expect(subject).to receive(:should_refresh?).and_return(false)
      expect(subject).not_to receive(:make_request)
      expect(subject).to receive(:current_credentials)
      subject.refresh
    end

    it 'raises NoRefreshTokenError if there is no token to refresh' do
      auth_credential.update!({refresh_token: nil})
      expect(subject).to receive(:should_refresh?).and_return(true)
      expect(subject).not_to receive(:token_too_old_to_refresh?)
      expect { subject.refresh }.to raise_error(GoogleIntegration::RefreshAccessToken::NoRefreshTokenError)
    end

    it 'raises TokenTooOldToRefreshError if token is too old' do
      expect(subject).to receive(:should_refresh?).and_return(true)
      expect(subject).to receive(:token_too_old_to_refresh?).and_return(true)
      expect(subject).not_to receive(:make_request)
      expect { subject.refresh }.to raise_error(GoogleIntegration::RefreshAccessToken::TokenTooOldToRefreshError)
    end
  end

  describe '#make_request' do
    it 'should make a HTTParty post request' do
      refresh_options = {foo: 'bar'}
      expect(subject).to receive(:refresh_token_options).and_return(refresh_options)
      expect(HTTParty).to receive(:post).with(described_class::TOKEN_ENDPOINT, refresh_options)
      subject.send(:make_request)
    end
  end

  describe '#handle_response' do
    it 'should store credentials if the refresh request returns a 200' do
      response_dbl = double
      expect(response_dbl).to receive(:code).and_return(200)
      expect(subject).to receive(:store_credentials).with(response_dbl)
      subject.send(:handle_response, response_dbl)
    end

    it 'should raise FailedToRefreshTokenError if the refresh request returns a non-200' do
      response_dbl = double
      expect(response_dbl).to receive(:code).and_return(400)
      expect(response_dbl).to receive(:parsed_response).and_return({'error'=>'error'})
      expect { subject.send(:handle_response, response_dbl) }.to raise_error(GoogleIntegration::RefreshAccessToken::FailedToRefreshTokenError)
    end

    it 'should return false if the refresh request returns a non-200' do
      response_dbl = double
      expect(response_dbl).to receive(:code).and_return(400)
      expect(response_dbl).to receive(:parsed_response).and_return({'error'=>'error'})
      expect { subject.send(:handle_response, response_dbl) }.to raise_error(GoogleIntegration::RefreshAccessToken::FailedToRefreshTokenError)
      expect(subject.send(:should_refresh?)).to be false
    end
  end

  describe '#store_credentials' do
    it 'should persist credentials and reload them if successful' do
      parsed_response = {foo: 'bar'}
      response_dbl = double
      expect(response_dbl).to receive(:parsed_response).and_return(parsed_response)
      expect(subject).to receive(:parse_attributes).with(parsed_response).and_return(parsed_response)
      expect(auth_credential).to receive(:update).with(parsed_response).and_return(true)
      expect(auth_credential).to receive(:reload)
      subject.send(:store_credentials, response_dbl)
    end

    it 'should raise FailedToSaveRefreshedTokenError if credential update fails' do
      parsed_response = {foo: 'bar'}
      response_dbl = double
      expect(response_dbl).to receive(:parsed_response).and_return(parsed_response)
      expect(subject).to receive(:parse_attributes).with(parsed_response).and_return(parsed_response)
      expect(auth_credential).to receive(:update).with(parsed_response).and_return(false)
      expect(auth_credential).not_to receive(:reload)
      expect { subject.send(:store_credentials, response_dbl) }.to raise_error(GoogleIntegration::RefreshAccessToken::FailedToSaveRefreshedTokenError)
    end
  end

  describe '#parse_attributes' do
    it 'should convert key named "access_token" to :access_token' do
      input = {'access_token' => 'foo'}
      output = {access_token: 'foo'}
      expect(subject.send(:parse_attributes, input)).to eq(output)
    end

    it 'should convert key named "expires_in" to :expires_at' do
      input = {'expires_in' => 3600 }
      output = {expires_at: 3600.seconds.from_now }
      expect(subject.send(:parse_attributes, input)).to eq(output)
    end

    it 'should convert key named "issued_at" to :timestamp' do
      input = {'issued_at' => 'foo'}
      output = {timestamp: 'foo'}
      expect(subject.send(:parse_attributes, input)).to eq(output)
    end

    it 'should ignore any other passed in keys' do
      input = {foo: 'bar'}
      output = {}
      expect(subject.send(:parse_attributes, input)).to eq(output)
    end
  end

  describe '#refresh_token' do
    it 'should call auth_credential.refresh_token if there is a token to refresh' do
      expect(subject.send(:refresh_token)).to eq(auth_credential.refresh_token)
    end
  end

  describe '#current_credentials' do
    it 'should return the auth_credential for the initial user' do
      expect(subject.send(:current_credentials)).to eq(auth_credential)
    end
  end

  describe '#should_refresh?' do
    it 'should return false if there are no current credentials for the user' do
      user.auth_credential.destroy!
      expect(subject.send(:should_refresh?)).to be false
    end

    it 'should return false if there is no available refresh token' do
      user.auth_credential.update!({refresh_token: nil})
      expect(subject.send(:should_refresh?)).to be false
    end

    it 'should return true if the credentials have no expiration recorded' do
      user.auth_credential.update!({expires_at: nil})
      expect(subject.send(:should_refresh?)).to be true
    end

    it 'should return true if the credentials have an expired expiration' do
      user.auth_credential.update!({expires_at: 1.day.ago})
      expect(subject.send(:should_refresh?)).to be true
    end

    it 'should return false if the current token is unexpired' do
      expect(subject.send(:should_refresh?)).to be false
    end
  end

  describe '#token_too_old_to_refresh?' do
    it 'should return true if the token is more than 6 months old' do
      user.auth_credential.update!({expires_at: 12.months.ago})
      expect(subject.send(:token_too_old_to_refresh?)).to be true
    end

    it 'should return false if the token is less than 6 months old' do
      user.auth_credential.update!({expires_at: 1.month.ago})
      expect(subject.send(:token_too_old_to_refresh?)).to be false
    end
  end

  describe '#refresh_token_options' do
    it 'should return the expected payload' do
      client_id = 'foo'
      client_secret = 'bar'
      refresh_token = 'baz'
      expected_payload = {
        body: {
          client_id: client_id,
          client_secret: client_secret,
          refresh_token: refresh_token,
          grant_type: 'refresh_token'
        },
        headers: {
          'Content-Type' => 'application/x-www-form-urlencoded'
        }
      }

      expect(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return(client_id)
      expect(ENV).to receive(:[]).with('GOOGLE_CLIENT_SECRET').and_return(client_secret)
      expect(subject).to receive(:refresh_token).and_return(refresh_token)
      expect(subject.send(:refresh_token_options)).to eq(expected_payload)
    end
  end
end
