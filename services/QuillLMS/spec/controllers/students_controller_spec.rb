# frozen_string_literal: true

require 'rails_helper'


describe StudentsController do
  let(:user) { create(:student) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :authorize! }

  describe '#index' do
    let!(:classroom) { create(:classroom) }
    let!(:students_classrooms) { create(:students_classrooms, student_id: user.id, classroom_id: classroom.id) }

    it 'should set the current user and js file' do
      get :index
      expect(assigns(:current_user)).to eq user
      expect(assigns(:js_file)).to eq "student"
    end

    it 'should find the classroom and set flash' do
      get :index, params: { joined: "success", classroom: classroom.id }
      expect(flash["join-class-notification"]).to eq "You have joined #{classroom.name} 🎉🎊"
    end
  end

  describe '#join_classroom' do
    let(:student) { create(:student) }

    before { allow(controller).to receive(:current_user) { student } }

    it 'should redirect for an invalid class_code' do
      get :join_classroom, params: { classcode: 'nonsense_doesnt_exist' }

      expect(response).to redirect_to '/classes'
      expect(flash[:error]).to match("Oops! There is no class with the code nonsense_doesnt_exist. Ask your teacher for help.")
    end

    it 'should redirect for a valid class_code' do
      classroom = create(:classroom, code: 'existing_code')
      get :join_classroom, params: { classcode: classroom.code }

      expect(response).to redirect_to "/classrooms/#{classroom.id}?joined=success"
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
    context 'when Angie Thomas exists' do
      let!(:angie) { create(:user, email: 'angie_thomas_demo@quill.org') }

      it 'should sign in angie and redirect to profile' do
        get :student_demo
        expect(session[:user_id]).to eq angie.id
        expect(response).to redirect_to '/classes'
      end
    end

    context 'when angie thomas does not exist' do
      it 'should destroy recreate the demo and redirect to student demo' do
        expect(Demo::ReportDemoCreator).to receive(:create_demo).with(nil, {:teacher_demo=>true})
        get :student_demo
        expect(response).to redirect_to "/student_demo"
      end
    end
  end

  describe '#student_demo_ap' do
    context 'when bell hooks exists' do
      let!(:bell) { create(:user, email: 'bell_hooks_demo@quill.org') }

      it 'should sign in bell and redirect to profile' do
        get :demo_ap
        expect(session[:user_id]).to eq bell.id
        expect(response).to redirect_to '/classes'
      end
    end

    context 'when bell hooks does not exist' do
      it 'should recreate the demo and redirect to student demo' do
        expect(Demo::ReportDemoAPCreator).to receive(:create_demo).with(nil)
        get :demo_ap
        expect(response).to redirect_to "/student_demo_ap"
      end
    end
  end

  describe '#update_account' do
    let!(:user) { create(:user, name: "Maya Angelou", email: 'maya_angelou_demo@quill.org', username: "maya-angelou", role: "student") }
    let!(:second_user) { create(:user, name: "Harvey Milk", email: 'harvey@quill.org', username: "harvey-milk", role: "student") }

    it 'should update the name, email and username' do
      put :update_account, params: { email: "pablo@quill.org", username: "pabllo-vittar", name: "Pabllo Vittar" }
      expect(user.reload.email).to eq "pablo@quill.org"
      expect(user.reload.username).to eq "pabllo-vittar"
      expect(user.reload.name).to eq "Pabllo Vittar"
    end

    it 'should update only the fields that are changed' do
      put :update_account, params: { email: "pablo@quill.org", username: "rainha-do-carnaval", name: "Pabllo Vittar" }
      expect(user.reload.email).to eq "pablo@quill.org"
      expect(user.reload.username).to eq "rainha-do-carnaval"
      expect(user.reload.name).to eq "Pabllo Vittar"
    end

    it 'should not update the email or username if already taken' do
      put :update_account, params: { email: "harvey@quill.org", username: "pabllo-vittar", name: "Pabllo Vittar" }
      expect(user.reload.errors.messages[:email].first).to eq "That email is taken. Try another."
      put :update_account, params: { email: "pablo@quill.org", username: "harvey-milk", name: "Pabllo Vittar" }
      expect(user.reload.errors.messages[:username].first).to eq "That username is taken. Try another."
    end
  end
end
