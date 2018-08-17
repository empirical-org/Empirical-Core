require 'rails_helper'

RSpec.describe NotificationsController do
  describe '#index' do
    it 'returns 200' do
      get :index, format: :json

      expect(response).to have_http_status(:ok)
    end

    it 'renders template' do
      get :index, format: :json

      expect(response).to render_template(:index)
    end

    it 'assigns @notifications scoped to current user' do
      user = create(:simple_user)
      notification = create(:notification, user: user)

      allow(controller).to receive(:current_user).and_return(user)
      get :index, format: :json

      expect(assigns(:notifications)).to eq([notification])
    end
  end
end
