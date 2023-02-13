# frozen_string_literal: true

require 'rails_helper'

describe Auth::CleverController, type: :controller do
  let(:user) { create(:user) }

  describe '#update_current_user_email' do

    before do
      allow(controller).to receive(:current_user) { user }

      request.env['omniauth.auth'] = OmniAuth::AuthHash.new({
        info: {
          email: 'omniauth@email.com',
          user_type: 'school_admin'
        }
      })
    end

    context 'validation success' do
      it 'should not invoke ErrorNotifier' do
        allow_any_instance_of(ApplicationController).to receive(:route_redirects_to_my_account?).and_return true
        allow(CleverIntegration::SignUp::SchoolAdmin).to receive(:run).and_return({type: 'user_success', data: user})
        expect(ErrorNotifier).to receive(:report).exactly(0).times
        expect { get 'clever' }.to_not raise_error
      end
    end

    context 'validation failure' do
      it 'should invoke ErrorNotifier' do
        allow_any_instance_of(ApplicationController).to receive(:route_redirects_to_my_account?).and_return true
        allow(CleverIntegration::SignUp::SchoolAdmin).to receive(:run).and_return({type: 'user_success', data: user})
        allow(user).to receive(:update).and_return false
        expect(ErrorNotifier).to receive(:report).once
        expect { get 'clever' }.to_not raise_error
      end
    end
  end

  describe 'signing up as an admin' do
    it 'should set user role as "admin" and verify email if session[:role] is admin' do
      user.require_email_verification
      allow(controller).to receive(:current_user) { user }
      request.env['omniauth.auth'] = OmniAuth::AuthHash.new({
        info: {
          email: 'omniauth@email.com',
          user_type: 'school_admin'
        }
      })
      allow_any_instance_of(ApplicationController).to receive(:route_redirects_to_my_account?).and_return true
      allow(CleverIntegration::SignUp::SchoolAdmin).to receive(:run).and_return({type: 'user_success', data: user})

      expect { get 'clever', params: {}, session: {role: User::ADMIN} }.to_not raise_error
      expect(user.reload.email_verified?).to be(true)
      expect(user.reload.user_email_verification.verification_method).to eq(UserEmailVerification::CLEVER_VERIFICATION)
    end
  end
end
