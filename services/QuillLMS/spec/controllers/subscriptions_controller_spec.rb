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
        expect(assigns(:subscription_status)).to eq user.subscription_status
        expect(assigns(:premium_credits)).to eq user.credit_transactions
        expect(assigns(:school_subscription_types)).to eq Subscription::OFFICIAL_SCHOOL_TYPES
        expect(assigns(:trial_types)).to eq Subscription::TRIAL_TYPES
      end
    end

    describe '#index as json' do
      it 'should set the instance variables' do
        get :index, params: { :format => 'json' }
        expect(JSON.parse(response.body)['subscriptions']).to eq JSON.parse(user.subscriptions.to_json)
        expect(JSON.parse(response.body)['subscription_status']).to eq JSON.parse(user.subscription_status.to_json)
        expect(JSON.parse(response.body)['premium_credits']).to eq JSON.parse(user.credit_transactions.to_json)
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

  context "with school admin" do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }
    let!(:schools_admins1) { create(:schools_admins, school: school1) }
    let!(:schools_admins2) { create(:schools_admins, user: schools_admins1.user, school: school2) }
    let!(:subscription1) { create(:subscription, account_type: Subscription::SCHOOL_PAID ) }
    let!(:school_subscription1) { create(:school_subscription, subscription: subscription1, school: school1) }
    let!(:subscription2) { create(:subscription, account_type: Subscription::SCHOOL_PAID, expiration: '2020-01-1'.to_date ) }
    let!(:school_subscription2) { create(:school_subscription, subscription: subscription2, school: school2) }

    before { allow(controller).to receive(:current_user) { schools_admins1.user } }

    describe '#school_admin_subscriptions' do
      it 'should set the instance variables' do
        get :school_admin_subscriptions, params: { :format => 'json' }
        expect(JSON.parse(response.body)['user_associated_school_id']).to eq schools_admins1.user.school
        expect(JSON.parse(response.body)['schools'][0]['id']).to eq JSON.parse(school1.id.to_json)
        expect(JSON.parse(response.body)['schools'][0]['name']).to eq JSON.parse(school1.name.to_json)
        expect(JSON.parse(response.body)['schools'][0]['subscriptions']).to eq JSON.parse(school1.subscriptions.to_json)
        expect(JSON.parse(response.body)['schools'][0]['subscription_status']).to eq JSON.parse(school1.subscription.subscription_status.to_json)
        expect(JSON.parse(response.body)['schools'][1]['id']).to eq JSON.parse(school2.id.to_json)
        expect(JSON.parse(response.body)['schools'][1]['name']).to eq JSON.parse(school2.name.to_json)
        expect(JSON.parse(response.body)['schools'][1]['subscriptions']).to eq JSON.parse(school2.subscriptions.to_json)
        expect(JSON.parse(response.body)['schools'][1]['subscription_status']).to eq JSON.parse(school2.last_expired_subscription.subscription_status.to_json)
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
