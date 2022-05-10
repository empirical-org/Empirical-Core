# frozen_string_literal: true

require 'rails_helper'

describe SubscriptionsController do
  let!(:user) { create(:teacher, :premium) }

  context "with teacher" do
    before { allow(controller).to receive(:current_user) { user } }

    describe '#index' do
      it 'should set the instance variables' do
        get :index
        expect(assigns(:subscriptions)).to eq user.subscriptions
        expect(assigns(:premium_credits)).to eq user.credit_transactions
        expect(assigns(:school_subscription_types)).to eq Subscription::OFFICIAL_SCHOOL_TYPES
        expect(assigns(:trial_types)).to eq Subscription::TRIAL_TYPES
      end
    end

    describe '#index w/o subscription' do
      let!(:user_no_subscription) { create(:teacher) }

      before { allow(controller).to receive(:current_user) { user_no_subscription } }

      it 'return valid response' do
        get :index
        expect(response.status).to eq(200)
      end

      it 'sets subscription status to nil' do
        get :index
        expect(assigns(:subscription_status)).to eq nil
      end
    end

    describe "#purchaser_name" do
      context 'when subscription is not associated with current user' do
        let(:another_user) { create(:user) }

        before do
          allow_any_instance_of(Subscription).to receive(:users) { [another_user] }
          user.subscriptions.first.update(purchaser: another_user)
        end

        it 'should sign the user out' do
          get :purchaser_name, params: { id: user.subscriptions.first.id }
          expect(session[:attempted_path]).to eq request.fullpath
          expect(response).to redirect_to new_session_path
        end
      end

      context 'when subscription is associated with current user' do
        it 'should render the purchaser name' do
          user.subscriptions.first.update(purchaser: user)
          get :purchaser_name, params: { id: user.subscriptions.first.id }
          expect(response.body).to eq({name: user.name}.to_json)
        end
      end
    end

    describe '#create' do
      it 'should create the subscription' do
        post :create,
          params: {
            subscription: {
              purchaser_id: user.id,
              expiration: 10.days.from_now.to_date,
              account_type: "some_type",
              recurring: false
            }
          }
        expect(user.reload.subscriptions.last.account_type).to eq "some_type"
        expect(user.reload.subscriptions.last.recurring).to eq false
      end
    end

    describe '#update' do
      it 'should update the given subscription' do
        post :update, params: { id: user.subscriptions.first, subscription: { account_type: "some_type" } }
        expect(user.reload.subscriptions.first.account_type).to eq "some_type"
      end
    end

    describe '#destroy' do
      it 'should destroy the given subscription' do
        subscription = user.subscriptions.first
        delete :destroy, params: { id: subscription.id }
        expect{ Subscription.find(subscription.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end
  end

  context "without user" do

    before { allow(controller).to receive(:current_user) { nil } }

    describe '#index' do
      it 'should redirect to login' do
        get :index

        expect(response).to redirect_to('/session/new')
      end
    end
  end

end
