require 'rails_helper'

describe SubscriptionsController do
  let!(:user) { create(:teacher, :premium) }

  context "with teacher" do
    before do
      allow(controller).to receive(:current_user) { user }
    end

    describe '#index' do
      it 'should set the instance variables' do
        get :index
        expect(assigns(:subscriptions)).to eq user.subscriptions
        expect(assigns(:premium_credits)).to eq user.credit_transactions
        expect(assigns(:school_subscription_types)).to eq Subscription::OFFICIAL_SCHOOL_TYPES
        expect(assigns(:last_four)).to eq user.last_four
        expect(assigns(:trial_types)).to eq Subscription::TRIAL_TYPES
      end
    end

    describe '#index w/o subscription' do
      let!(:user_no_subscription) { create(:teacher) }
      before do
        allow(controller).to receive(:current_user) { user_no_subscription }
      end

      it 'return valid response' do
        get :index
        expect(response.status).to eq(200)
      end
    end

    describe '#activate_covid_subscription' do
      context 'when the user does not have any subscriptions' do
        let!(:user_with_no_subscriptions) { create(:user) }

        before do
          allow(controller).to receive(:current_user) { user_with_no_subscriptions }
        end

        it 'should call the create with user join on the subscription model' do
          expect(Subscription).to receive(:create_with_user_join).with(user_with_no_subscriptions.id, { account_type: Subscription::COVID_19_SUBSCRIPTION_TYPE})
        end
      end

      context 'when the user has a subscription that is not covid 19' do
        let!(:user_with_non_covid_subscription) { create(:user) }
        let!(:non_covid_subscription ) { Subscription.create_with_user_join(user_with_non_covid_subscription.id, account_type: 'Teacher Paid') }

        before do
          allow(controller).to receive(:current_user) { user_with_non_covid_subscription }
        end

        it 'should call the create with user join on the subscription model' do
          expect(Subscription).to receive(:create_with_user_join).with(user_with_non_covid_subscription.id, { account_type: Subscription::COVID_19_SUBSCRIPTION_TYPE})
        end
      end

      context 'when the user has a subscription that is covid 19' do
        let!(:user_with_covid_subscription) { create(:user) }
        let!(:covid_subscription ) { Subscription.create_with_user_join(user_with_covid_subscription.id, account_type: Subscription::COVID_19_SUBSCRIPTION_TYPE) }

        before do
          allow(controller).to receive(:current_user) { user_with_covid_subscription }
        end

        it 'should call the create with user join on the subscription model' do
          expect(Subscription).not_to receive(:create_with_user_join).with(user_with_covid_subscription.id, { account_type: Subscription::COVID_19_SUBSCRIPTION_TYPE})
        end
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
          get :purchaser_name, id: user.subscriptions.first.id
          expect(session[:attempted_path]).to eq request.fullpath
          expect(response).to redirect_to new_session_path
        end
      end

      context 'when subscription is associated with current user' do
        it 'should render the purchaser name' do
          user.subscriptions.first.update(purchaser: user)
          get :purchaser_name, id: user.subscriptions.first.id
          expect(response.body).to eq({name: user.name}.to_json)
        end
      end
    end

    describe '#create' do
      it 'should create the subscription' do
        post :create, subscription: { purchaser_id: user.id, expiration: Date.today+10.days, account_type: "some_type", recurring: false }
        expect(user.reload.subscriptions.last.account_type).to eq "some_type"
        expect(user.reload.subscriptions.last.recurring).to eq false
      end
    end

    describe '#update' do
      it 'should update the given subscription' do
        post :update, id: user.subscriptions.first, subscription: { account_type: "some_type" }
        expect(user.reload.subscriptions.first.account_type).to eq "some_type"
      end
    end

    describe '#destroy' do
      it 'should destroy the given subscription' do
        subscription = user.subscriptions.first
        delete :destroy, id: subscription.id
        expect{ Subscription.find(subscription.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end
  end

  context "without user" do

    before(:each) do
      allow(controller).to receive(:current_user) { nil }
    end

    describe '#index' do

      it 'should redirect to login' do
        get :index

        response.should redirect_to '/session/new'
      end
    end

  end

end
