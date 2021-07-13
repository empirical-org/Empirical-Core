require 'rails_helper'

describe Auth::GoogleController, type: :controller do

  it 'shows error message for nonexistent accounts with no role' do
<<<<<<< HEAD
    get 'google', params: { :role => nil }
=======
    get 'authorization_and_authentication', {:role => nil}
>>>>>>> fa7fe6822 (Fix failing spec)
    expect(flash[:error]).to include("We could not find your account. Is this your first time logging in?")
    expect(response).to redirect_to "/session/new"
  end

end
