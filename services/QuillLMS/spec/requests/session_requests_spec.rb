# frozen_string_literal: true

require 'rails_helper'

describe 'Session requests', type: :request do
  context 'when authenticity_token is invalid' do
    let(:referer) { 'http://localhost:3000/session/new' }
    let(:redirect) { URI.parse(referer).path }

    context 'forgery protection enabled' do
      before { ActionController::Base.allow_forgery_protection = true }

      after { ActionController::Base.allow_forgery_protection = false }

      it 'the exception should be rescued and redirected to the referer' do
        post '/session/login_through_ajax',
          params: { user: { email: '' } },
          headers: { 'HTTP_REFERER' => referer },
          as: :json

        expect(flash[:error]).to eq(I18n.t('actioncontroller.errors.invalid_authenticity_token'))
        expect(response.body).to eq({ redirect: redirect}.to_json)
      end
    end
  end
end
