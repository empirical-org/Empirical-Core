require 'rails_helper'

describe AccountsController, type: :controller do
  it 'should allow session role to become student or teacher but not staff' do
    post :role, role: 'staff'
    expect(@request.session[:role]).to eq(nil)
    post :role, role: 'student'
    expect(@request.session[:role]).to eq('student')
    post :role, role: 'teacher'
    expect(@request.session[:role]).to eq('teacher')
  end

  context 'referral feature' do
    describe 'on create' do
      before(:each) do
        @previous_users_count = User.count
        @previous_referrals_users_count = ReferralsUser.count
      end

      it 'should not create a ReferralsUser if a student is signing up' do
        post :create, user: build_stubbed(:student).attributes.merge({password: 'password'})
        expect(response.status).to be(200)
        expect(User.count).to be(@previous_users_count + 1)
        expect(ReferralsUser.count).to be(@previous_referrals_users_count)
      end

      it 'should not create a ReferralsUser if there is no referral code' do
        post :create, user: build_stubbed(:teacher).attributes.merge({password: 'password'})
        expect(response.status).to be(200)
        expect(User.count).to be(@previous_users_count + 1)
        expect(ReferralsUser.count).to be(@previous_referrals_users_count)
      end

      it 'should not create a ReferralsUser if the referral code does not exist' do
        post :create, user: build_stubbed(:teacher).attributes.merge({password: 'password'}), champion: 'nonexistant'
        expect(response.status).to be(200)
        expect(User.count).to be(@previous_users_count + 1)
        expect(ReferralsUser.count).to be(@previous_referrals_users_count)
      end

      it 'should create a ReferralsUser' do
        request.env['affiliate.tag'] = create(:teacher).referral_code
        post :create, user: build_stubbed(:teacher).attributes.merge({password: 'password'})
        expect(response.status).to be(200)
        expect(User.count).to be(@previous_users_count + 2)
        expect(ReferralsUser.count).to be(@previous_referrals_users_count + 1)
      end
    end
  end
end
