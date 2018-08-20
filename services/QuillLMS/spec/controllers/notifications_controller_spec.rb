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

    it 'assigns @notifications scoped to current user if student' do
      student = create(:simple_user, role: 'student')
      notification = create(:notification, user: student)

      allow(controller).to receive(:current_user).and_return(student)
      get :index, format: :json

      expect(assigns(:notifications)).to eq([notification])
    end

    it 'assigns @notifications scoped to students belonging to current user if teacher' do
      teacher      = create(:simple_user, role: 'teacher', email: 'teacher@example.com')
      student      = create(:simple_user, role: 'student')
      notification = create(:notification, user: student)
      classroom    = create(:simple_classroom)
      create(:classrooms_teacher, user: teacher, classroom: classroom, role: 'owner')
      create(:students_classrooms, student: student, classroom: classroom)

      allow(controller).to receive(:current_user).and_return(teacher)
      get :index, format: :json

      expect(assigns(:notifications)).to eq([notification])
    end
  end
end
