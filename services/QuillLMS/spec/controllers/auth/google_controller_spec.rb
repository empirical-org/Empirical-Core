# frozen_string_literal: true

require 'rails_helper'

describe Auth::GoogleController, type: :controller do

  it 'shows error message for nonexistent accounts with no role' do
    get 'online_access_callback', params: { role: nil }
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

  describe 'role behavior' do
    let(:user) { create(:user) }

    before do
      google_user_double = double
      allow(GoogleIntegration::User).to receive(:new).and_return(google_user_double)
      allow(google_user_double).to receive(:update_or_initialize).and_return(user)
    end

    it 'shows error message for sales-contact accounts' do
      user.update(role: User::SALES_CONTACT)

      get 'online_access_callback', params: { email: user.email, role: nil }
      expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
      expect(response).to redirect_to "/session/new"
    end

    it 'updates role for sales-contact accounts when session[:role] is set' do
      session_role = 'teacher'
      user.update(role: User::SALES_CONTACT)

      get 'online_access_callback', params: { email: user.email, role: nil }, session: { role: session_role }
      expect(flash[:error]).to be(nil)
      expect(user.reload.role).to eq(session_role)
    end

    it 'updates role to teacher for user when session[:role] is set to individual contributor' do
      session_role = User::INDIVIDUAL_CONTRIBUTOR
      user.update(role: User::INDIVIDUAL_CONTRIBUTOR)

      get 'online_access_callback', params: { email: user.email, role: nil }, session: { role: session_role }
      expect(flash[:error]).to be(nil)
      expect(user.reload.role).to eq(User::TEACHER)
    end

    it 'should set user role as "admin" and verify email if session[:role] is admin' do
      user.update(role: User::ADMIN)
      user.require_email_verification

      get 'online_access_callback', params: { email: user.email, role: nil }, session: { role: User::ADMIN }

      expect(user.reload.role).to eq(User::ADMIN)
      expect(user.reload.email_verified?).to be(true)
      expect(user.reload.user_email_verification.verification_method).to eq(UserEmailVerification::GOOGLE_VERIFICATION)
    end
  end
end
