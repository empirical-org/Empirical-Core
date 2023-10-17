# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sign in', type: :request do
  subject { post '/session/login_through_ajax', params: params, as: :json }

  let(:user) { create(:user) }

  describe 'POST /session/login_through_ajax' do
    context 'with valid params' do
      let(:params) { { user: { email: user.email, password: user.password } } }

      it 'is authorized' do
        subject
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)).to eq({ 'redirect' => '/' })
      end
    end

    context 'with invalid params' do
      let(:params) { { user: { email: user.email, password: 'wrong-password' } } }

      it 'is unauthorized' do
        subject
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
