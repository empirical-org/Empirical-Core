# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EmailSubscriptionsController, type: :controller do
  let(:user) { create(:user) }
  let(:user_id) { user.id }
  let(:json_response) { JSON.parse(response.body) }
  let(:subscription_type) { EmailSubscription::ADMIN_DIAGNOSTIC_REPORT }

  before { allow(controller).to receive(:current_user).and_return(user) }

  describe 'GET #current' do
    subject { get :current, params: { email_subscription_type: subscription_type } }

    let!(:email_subscription) { create(:email_subscription, user_id:, subscription_type:) }

    before { subject }

    it { expect(json_response['id']).to eq(email_subscription.id) }
    it { expect(json_response['subscription_type']).to eq(email_subscription.subscription_type) }
    it { expect(json_response['frequency']).to eq(email_subscription.frequency) }

    context 'email subscription does not exist' do
      let(:email_subscription) { nil }

      it { expect(json_response).to be_nil }
    end
  end

  describe 'POST #create_or_update' do
    subject { post :create_or_update, format:, params: {email_subscription_type: subscription_type, subscription: {params:, frequency:}} }

    let(:format) { :js }
    let(:params) { {overview_params: {timeframe: 'this-school-year'}} }
    let(:frequency) { EmailSubscription::MONTHLY }

    it { expect { subject }.to change(EmailSubscription, :count).by(1) }

    context 'when updating an existing subscription' do
      let(:old_freq) { EmailSubscription::WEEKLY }
      let(:new_freq) { EmailSubscription::MONTHLY }
      let(:email_subscription) { create(:email_subscription, user:, frequency: old_freq) }

      it { expect{subject}.to change { email_subscription.reload.frequency }.from(old_freq).to(new_freq) }
    end
  end

  describe 'DELETE #destroy' do
    #subject { delete :destroy, params: {email_subscription_type: subscription_type, cancel_token:}, format: }
    subject { delete :destroy, params: {email_subscription_type: subscription_type} }

    let(:cancel_token) { email_subscription&.cancel_token }

    context 'when the email subscription belongs to the current user' do
      let!(:email_subscription) { create(:email_subscription, user_id:, subscription_type:) }

      context 'HTML format' do
        let(:format) { :html }

        it 'deletes the subscription and redirects to root path with notice' do
          expect { subject }.to change(EmailSubscription, :count).by(-1)
          expect(response).to redirect_to(root_path)
          expect(flash[:notice]).to eq('You have been unsubscribed from the Admin Usage Snapshot Report')
        end
      end

      context 'JSON format' do
        let(:format) { :json }

        it 'deletes the subscription and returns status ok' do
          expect { subject }.to change(EmailSubscription, :count).by(-1)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context 'when the email subscription does not exist' do
      context 'HTML format' do
        let(:format) { :html }
        let(:cancel_token) { 'MADE_UP_TOKEN' }

        it 'redirects to root path with error' do
          expect { subject }.to change(EmailSubscription, :count).by(0)
          expect(response).to redirect_to(root_path)
          expect(flash[:error]).to eq('Subscription not found')
        end
      end

      context 'JSON format' do
        let(:format) { :json }
        let!(:email_subscription) { nil }

        it 'returns status missing' do
          expect { subject }.not_to change(EmailSubscription, :count)
          expect(response).to have_http_status(:missing)
        end
      end
    end
  end

  describe 'GET #unsubscribe' do
    subject { get :unsubscribe, params: { cancel_token: } }

    let!(:email_subscription) { create(:email_subscription, user_id:, subscription_type:) }

    context 'when no email subscription is found with that token' do
      let(:cancel_token) { 'invalid-token' }

      it 'does not change subscription count and redirects to root path with error' do
        expect { subject }.not_to change(EmailSubscription, :count)
        expect(response).to redirect_to(root_path)
        expect(flash[:error]).to eq('Subscription not found')
      end
    end
  end
end
