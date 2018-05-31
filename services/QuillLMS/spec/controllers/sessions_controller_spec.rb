require 'rails_helper'

describe SessionsController, type: :controller do
  before do
    User.create(email: 'student@quill.org',
                name: 'John Smith',
                username: 'student1',
                password: '12345',
                password_confirmation: '12345',
                role: 'student')
  end

  describe 'create with valid attributes' do
    before do
      post :create, user: {email: 'Student@quill.org', password: '12345'}
    end

    it { is_expected.to redirect_to profile_path }
  end

  describe 'create with invalid attributes' do
    before do
      post :create, user: {email: 'Student@quill.org', password: 'wrong'}
    end

    it { is_expected.not_to redirect_to profile_path }
  end

  describe '#login_through_ajax with' do
    STANDARD_REDIRECT_ROUTE = {"redirect" => '/'}
    describe 'an auditor flag' do
      let!(:auditor) {create(:teacher, flags: ['auditor'], password: '12345') }
      let!(:school) {create(:school)}
      let!(:subscription) {create(:subscription)}
      let!(:school_subscription) {create(:school_subscription, school: school, subscription: subscription)}
      let(:user_subscription) {create(:user_subscription, user: auditor, subscription: subscription)}
      it 'redirects to the standard redirect route if the user does not have a school subscription' do
        post :login_through_ajax, user: {email: auditor.email, password: '12345'}
        expect(JSON.parse(response.body)).to eq(STANDARD_REDIRECT_ROUTE)
      end
      it 'redirects to the subscriptions page if the user does have a school subscription' do
        user_subscription
        post :login_through_ajax, user: {email: auditor.email, password: '12345'}
        expect(JSON.parse(response.body)).to eq({"redirect" => "/subscriptions"})
      end
    end

    describe 'valid attributes' do
      before do
        post :login_through_ajax, user: {email: 'Student@quill.org', password: '12345'}
      end

      it "returns the standard redirect route" do
        expect(JSON.parse(response.body)).to eq(STANDARD_REDIRECT_ROUTE)
      end
    end

    describe 'invalid attributes' do
      before do
        post :login_through_ajax, user: {email: 'Student@quill.org', password: 'wrong'}
      end

      it { is_expected.not_to redirect_to profile_path }
      it "returns an unauthorized message" do
          expect(response.message).to eq('Unauthorized')
      end
    end
  end




end
