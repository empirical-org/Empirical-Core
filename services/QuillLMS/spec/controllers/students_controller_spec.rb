require 'rails_helper'

describe StudentsController do
  it { should use_before_filter :authorize! }

  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:classroom) { create(:classroom) }

    it 'should set the current user and js file' do
      get :index
      expect(assigns(:current_user)).to eq user
      expect(assigns(:js_file)).to eq "student"
    end

    it 'should find the classroom and set flash' do
      get :index, joined: "success", classroom: classroom.id
      expect(flash["join-class-notification"]).to eq "You have joined #{classroom.name} 🎉🎊"
    end
  end

  describe '#account_settings' do
    it 'should set the current user and js file' do
      get :account_settings
      expect(assigns(:current_user)).to eq user
      expect(assigns(:js_file)).to eq "student"
    end
  end

  describe '#student_demo' do
    context 'when maya angelou exists' do
      let!(:maya) { create(:user, email: 'maya_angelou_demo@quill.org') }

      it 'should sign in maya and redirect to profile' do
        get :student_demo
        expect(session[:user_id]).to eq maya.id
        expect(response).to redirect_to '/profile'
      end
    end

    context 'when maya angelou does not exist' do
      it 'should destroy recreate the demo and redirect to student demo' do
        expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with(nil)
        expect(Demo::ReportDemoCreator).to receive(:create_demo).with(nil)
        get :student_demo
        expect(response).to redirect_to "/student_demo"
      end
    end
  end

  describe '#make_teacher' do
    context 'when params role student' do
      it 'should update the role and email' do
        post :make_teacher, email: "test@email.com"
        expect(user.reload.email).to eq "test@email.com"
        expect(user.reload.role).to eq "teacher"
      end
    end

    context 'when params role not student' do
      it 'should set the role as student if given' do
        post :make_teacher, role: "student", email: "test@email.com"
        expect(user.reload.role).to eq "student"
      end
    end
  end
end