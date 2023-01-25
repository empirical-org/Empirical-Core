# frozen_string_literal: true

require 'rails_helper'

describe Auth::GoogleController, type: :controller do

  it 'shows error message for nonexistent accounts with no role' do
    get 'online_access_callback', params: { role: nil }
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

  it 'shows error message for sales-contact accounts' do
    user = create(:user, role: User::SALES_CONTACT)

    google_user_double = double
    expect(GoogleIntegration::User).to receive(:new).and_return(google_user_double)
    expect(google_user_double).to receive(:update_or_initialize).and_return(user)

    get 'online_access_callback', params: { email: user.email, role: nil }
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

  it 'updates role for sales-contact accounts when session[:role] is set' do
    session_role = 'teacher'
    user = create(:user, role: User::SALES_CONTACT)

    google_user_double = double
    expect(GoogleIntegration::User).to receive(:new).and_return(google_user_double)
    expect(google_user_double).to receive(:update_or_initialize).and_return(user)

    get 'online_access_callback', params: { email: user.email, role: nil }, session: { role: session_role }
    expect(flash[:error]).to be(nil)
    expect(user.reload.role).to eq(session_role)
  end

  it 'updates role to teacher for user when session[:role] is set to individual contributor' do
    session_role = User::INDIVIDUAL_CONTRIBUTOR
    user = create(:user, role: User::INDIVIDUAL_CONTRIBUTOR)

    google_user_double = double
    expect(GoogleIntegration::User).to receive(:new).and_return(google_user_double)
    expect(google_user_double).to receive(:update_or_initialize).and_return(user)

    get 'online_access_callback', params: { email: user.email, role: nil }, session: { role: session_role }
    expect(flash[:error]).to be(nil)
    expect(user.reload.role).to eq(User::TEACHER)
  end
end
