# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OrttoIntegration::WebhooksController, type: :controller do

  describe '#create' do
    context 'valid event payload' do
      let!(:unsubscribed_user) {create(:user, email: 'a@b.com', send_newsletter: false)}
      let!(:subscribed_user) {create(:user, email: 'b@c.com', send_newsletter: true)}

      it 'should update the user\'s send_newsletter property to true' do
        post :create, params: {action_name: 'subscribe', email: unsubscribed_user.email }

        expect(User.find(unsubscribed_user.id).send_newsletter).to eq true
        expect(response.status).to eq 204
      end

      it 'should update the user\'s send_newsletter property to false' do
        post :create, params: {action_name: 'unsubscribe', email: subscribed_user }

        expect(User.find(subscribed_user.id).send_newsletter).to eq true
        expect(response.status).to eq 204
      end
    end

    context 'invalid payload' do
      it "handles the JSON format error and reports to new relic" do
        post :create, params: {invalid_param: 'xyz' }

        expect(response.status).to eq 400
      end
    end

  end
end
