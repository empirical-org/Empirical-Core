require 'rails_helper'

describe Auth::GoogleController, type: :controller do

  it 'shows error message for nonexistent accounts with no role' do
    get 'google', {:role => nil}
    expect(flash[:error]).to include("not associated with any Quill accounts yet")
    expect(response).to redirect_to "/session/new"
  end

end
