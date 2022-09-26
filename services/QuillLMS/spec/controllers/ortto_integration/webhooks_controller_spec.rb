# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OrttoIntegration::WebhooksController, type: :controller do

  describe '#create' do
    let(:ortto_secret) { 'xyz' }

    context 'valid event payload' do
      let!(:subscribed_user) { create(:user, email: 'a@b.com', send_newsletter: true) }

      it 'should update the user\'s send_newsletter property to false' do
        stub_const('ENV', { 'ORTTO_WEBHOOK_PASSWORD' => ortto_secret } )

        post :create, params: { email: subscribed_user.email, secret: ortto_secret }
        expect(User.find(subscribed_user.id).send_newsletter).to eq false
        expect(response.status).to eq 200
      end
    end

    context 'invalid payload' do
      context 'bad authentication' do
        it 'should return 403' do
          post :create, params: { email: 'an email', secret: 'incorrect secret' }
          expect(response.status).to eq 403
        end
      end

      context 'user not found' do
        it 'should return 202 and trigger an error report' do
          stub_const('ENV', { 'ORTTO_WEBHOOK_PASSWORD' => ortto_secret } )
          expect(ErrorNotifier).to receive(:report)
          post :create, params: { email: 'an email', secret: ortto_secret }

          expect(response.status).to eq 202
        end
      end
    end

  end
end
