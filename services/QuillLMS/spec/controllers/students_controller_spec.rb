require 'rails_helper'


describe StudentsController do
  it { should use_before_filter :authorize! }

  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:classroom) { create(:classroom) }
    let!(:students_classrooms) { create(:students_classrooms, student_id: user.id, classroom_id: classroom.id) }

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

  describe '#update_account' do
    let!(:user) { create(:user, name: "Maya Angelou", email: 'maya_angelou_demo@quill.org', username:"maya-angelou", role: "student") }
    it 'should update the name, email and username' do
      put :update_account, {email: "pvittar@email.com", username: "pabllo-vittar", name: "Pabllo Vittar"}
      expect(user.reload.email).to eq "pvittar@email.com"
      expect(user.reload.username).to eq "pabllo-vittar"
      expect(user.reload.name).to eq "Pabllo Vittar"
    end
  end
end
