# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Auth::LearnWorlds::SSORequest do
  subject { described_class.run(user) }

  context 'nil user' do
    let(:user) { nil }

    it { expect { subject }.to raise_error described_class::NilUserError }
  end

  context 'user exists with nil email' do
    let(:user) { create(:user, email: nil) }

    it { expect { subject }.to raise_error described_class::NilEmailError }
  end

  context 'user exists with email' do
    let(:user) { create(:user) }
    let(:url) { Auth::LearnWorlds::BASE_URI + "/login?code=#{SecureRandom.hex(32)}" }

    let(:sso_response) do
      {
        user_id: user_id,
        url: url,
        errors: [],
        success: true,
      }.stringify_keys
    end

    before { allow(HTTParty).to receive(:post).and_return(sso_response) }

    context 'learn_worlds_account does not exist' do
      let(:user_id) { SecureRandom.hex(12) }
      let(:data) do
        {
          email: user.email,
          redirectURL: Auth::LearnWorlds::COURSES_ENDPOINT,
          username: username
        }
      end

      context 'username is not nil' do
        let(:username) { user.username }

        it { expect(subject).to eq sso_response}

        it do
          expect(URI).to receive(:encode_www_form).with(data)
          subject
        end
      end

      context 'username is nil' do
        let(:username) { user.email }

        before { user.update(username: nil) }

        it do
          expect(URI).to receive(:encode_www_form).with(data)
          subject
        end
      end
    end

    context 'learn_worlds_account exists' do
      let(:learn_worlds_account) { create(:learn_worlds_account, user: user)}
      let(:user_id) { learn_worlds_account.external_id }

      let(:data) do
        {
          redirectURL: Auth::LearnWorlds::COURSES_ENDPOINT,
          user_id: user_id
        }
      end

      it { expect(subject).to eq sso_response}
    end
  end
end
