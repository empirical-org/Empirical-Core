require 'rails_helper'

RSpec.describe NotificationsController do
  describe '#index' do
    it 'returns 200' do
      user = create(:simple_user)
      allow(controller).to receive(:current_user).and_return(user)

      get :index, format: :json

      expect(response).to have_http_status(:ok)
    end

    it 'renders template' do
      user = create(:simple_user)
      allow(controller).to receive(:current_user).and_return(user)

      get :index, format: :json

      expect(response).to render_template(:index)
    end

    it 'assigns @notifications scoped to current user' do
      student = create(:simple_user, role: 'student')
      notification = create(:notification, user: student)

      allow(controller).to receive(:current_user).and_return(student)
      get :index, format: :json

      expect(assigns(:notifications)).to eq([notification])
    end
  end
end
