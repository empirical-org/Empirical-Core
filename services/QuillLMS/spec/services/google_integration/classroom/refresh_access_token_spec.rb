# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::RefreshAccessToken do
  let(:current_time) { Time.local(1990, 12, 20) }

  before { Timecop.freeze(current_time) }

  after { Timecop.return }

  it 'returns the new credentials if token is expired' do
    user = create(:user)
    expired_auth_credentials = create(:google_auth_credential,
      user: user,
      access_token: 'mr',
      expires_at: current_time - 1.day,
      refresh_token: 'haha-great'
    )
    http_client = double('http_client')

    response = double('response',
      code: 200,
      parsed_response: {
        'access_token' => 'what',
        'expires_in' => 60.minutes,
        'issued_at' => Time.current,
      }
    )

    expect(http_client).to receive(:post).and_return(response)

    credentials = GoogleIntegration::RefreshAccessToken.new(user, http_client).refresh

    expect(credentials).to have_attributes(
      access_token: 'what',
      expires_at: 1.day.from_now,
      timestamp: Time.current
    )
  end

  it 'updates the user credentials if token is expired' do
    user = create(:user)
    expired_auth_credentials = create(:google_auth_credential,
      user: user,
      access_token: 'mr',
      expires_at: current_time - 1.day,
      refresh_token: 'haha-great'
    )
    http_client = double('http_client')
    response = double('response',
      code: 200,
      parsed_response: {
        'access_token' => 'what',
        'expires_in' => 60.minutes,
        'issued_at' => Time.current,
      }
    )

    expect(http_client).to receive(:post).and_return(response)

    GoogleIntegration::RefreshAccessToken.new(user, http_client).refresh

    expect(expired_auth_credentials.reload).to have_attributes(
      access_token: 'what',
      expires_at: 1.day.from_now,
      timestamp: Time.current
    )
  end

  it 'does not attempt to refresh if current token is not expired' do
    user = create(:user)
    auth_credentials = create(:google_auth_credential,
      user: user,
      access_token: 'mr',
      expires_at: current_time + 1.day,
      refresh_token: 'haha-great',
    )
    http_client = double('http_client')

    expect(http_client).not_to receive(:post)

    GoogleIntegration::RefreshAccessToken.new(user, http_client).refresh
  end

  it 'returns the current credentials if not expired' do
    user = create(:user)
    auth_credentials = create(:google_auth_credential,
      user: user,
      access_token: 'mr',
      expires_at: current_time + 1.day,
      refresh_token: 'haha-great',
    )
    http_client = double('http_client')

    credentials = GoogleIntegration::RefreshAccessToken
      .new(user, http_client).refresh

    expect(credentials.access_token).to eq('mr')
  end
end
