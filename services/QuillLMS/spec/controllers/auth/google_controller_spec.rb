# frozen_string_literal: true

require 'rails_helper'

describe Auth::GoogleController, type: :controller do

  it 'shows error message for nonexistent accounts with no role' do
    get 'online_access_callback', params: { role: nil }
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

  it 'shows error message for non_authenticating? accounts with no role' do
    user = create(:user, role: User::SALES_CONTACT)

    omniauth_info_double = double
    expect(omniauth_info_double).to receive(:email).and_return(user.email)
    expect_any_instance_of(GoogleIntegration::Profile).to receive(:info).and_return(omniauth_info_double)

    get 'online_access_callback', params: { email: user.email, role: nil }
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

end
