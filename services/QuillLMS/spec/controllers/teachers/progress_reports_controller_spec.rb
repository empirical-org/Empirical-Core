# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ProgressReportsController do
  let(:teacher) { create(:teacher) }

  before { allow(controller).to receive(:current_user) { teacher } }

  it { should use_before_action :authorize! }
  it { should use_before_action :set_vary_header }

  describe '#demo' do
    context 'when name not given' do
      context 'when demo accounts exist' do
        let!(:user) { create(:user, email: "hello+demoteacher@quill.org" ) }
        let!(:ap_user) { create(:user, email: "hello+demoteacher+ap@quill.org" ) }

        it 'should use the hello+demot\eacher@quill account and redirect to scorebook teachers classrooms path' do
          get :demo
          expect(assigns(:user)).to eq user
          expect(response).to redirect_to scorebook_teachers_classrooms_path
        end

        it 'should use the hello+demot\eacher+ap@quill account and redirect to scorebook teachers classrooms path' do
          get :coach_demo
          expect(assigns(:ap_user)).to eq ap_user
          expect(response).to redirect_to scorebook_teachers_classrooms_path
        end
      end

      context 'when demo account does not exist' do
        before do
          allow(Demo::ReportDemoDestroyer).to receive(:destroy_demo) { true }
          allow(Demo::ReportDemoCreator).to receive(:create_demo) {|email| create(:user, email: email) }
        end

        it 'should destroy the current demo and create a new demo' do
          expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with("hello+demoteacher@quill.org")
          expect(Demo::ReportDemoCreator).to receive(:create_demo).with("hello+demoteacher@quill.org")
          get :demo
        end
      end
    end

    context 'when name is given' do
      context 'when demo account exists' do
        let!(:user) { create(:user, email: "hello+test@quill.org" ) }

        it 'should use the hello+test@quill account and redirect to scorebook teachers classrooms path' do
          get :demo, params: { name: "test" }
          expect(assigns(:user)).to eq User.find_by_email 'hello+test@quill.org'
          expect(response).to redirect_to scorebook_teachers_classrooms_path
        end

        context 'when when name is demoaccount' do
          let!(:user) { create(:user, email: "hello+demoaccount@quill.org" ) }

          it 'should redirect to teachers_progress_reports_concepts_students_path path' do
            get :demo, params: { name: "demoaccount" }
            expect(response).to redirect_to teachers_progress_reports_concepts_students_path
          end
        end

        context 'when name is admin demo' do
          let!(:user) { create(:user, email: "hello+admin_demo@quill.org" ) }

          it 'should redirect to profile path' do
            get :demo, params: { name: "admin_demo" }
            expect(response).to redirect_to profile_path
          end
        end
      end

      context 'when demo account does not exist' do
        before do
          allow(Demo::ReportDemoDestroyer).to receive(:destroy_demo) { true }
          allow(Demo::ReportDemoCreator).to receive(:create_demo) {|email| create(:user, email: email) }
        end

        it 'should destroy the current demo and create a new demo' do
          expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with("hello+test@quill.org")
          expect(Demo::ReportDemoCreator).to receive(:create_demo).with("hello+test@quill.org")
          get :demo, params: { name: "test" }
        end
      end
    end
  end

  describe '#admin_demo' do
    context 'when name given' do
      it 'sets the user and redirects to teacher_admin_dashboard path when user exists' do
        user = create(:user, email: "hello+demoadmin-test@quill.org")
        get :admin_demo, params: { name: "test" }
        expect(assigns(:admin_user)).to eq user
      end

      it 'sets the user, redirects to teacher_admin_dashboard path when user doesnt exist' do
        admin_report_service = double('admin_report_service')
        allow(admin_report_service).to receive(:call) do
          create(:user, email: "hello+demoadmin-test@quill.org")
        end

        expect(Demo::CreateAdminReport)
          .to receive(:new)
          .with("test", "test", "hello+demoadmin-test@quill.org")
          .and_return(admin_report_service)

        get :admin_demo, params: { name: "test" }
      end
    end

    context 'when name not given' do
      it 'sets the user and redirect to teacher_admin_dashboard path when user exists' do
        user = create(:user, email: "hello+demoadmin-admindemoschool@quill.org")

        get :admin_demo
        expect(assigns(:admin_user)).to eq user
      end

      it 'sets the user, redirects to teacher_admin_dashboard path when user does not exist' do
        admin_report_service = double('admin_report_service')
        allow(admin_report_service).to receive(:call) do
          create(:user, email: "hello+demoadmin-admindemoschool@quill.org")
        end

        expect(Demo::CreateAdminReport)
          .to receive(:new)
          .with("Admin Demo School", "admindemoschool", "hello+demoadmin-admindemoschool@quill.org")
          .and_return(admin_report_service)

        get :admin_demo
      end
    end
  end

  describe '#staff_demo' do
    context 'when demo account exists' do
      it 'sets the user and redirects to scorebook teachers classrooms path when user exists' do
        staff_user = create(:user, email: "hello+demoteacher+staff@quill.org")
        get :staff_demo
        expect(assigns(:staff_user)).to eq staff_user
        expect(response).to redirect_to scorebook_teachers_classrooms_path
      end
    end

    context 'when demo account does not exist' do
      before do
        allow(Demo::ReportDemoCreator).to receive(:create_demo) {|email| create(:user, email: email) }
      end

      it 'sets the user, redirects to scorebook teachers classrooms path when user doesnt exist' do
        expect(Demo::ReportDemoCreator).to receive(:create_demo).with("hello+demoteacher+staff@quill.org")

        get :staff_demo
        expect(response).to redirect_to scorebook_teachers_classrooms_path
      end
    end
  end

  describe '#coach_demo' do

    context 'when demo account exists' do
      it 'sets the user and redirects to scorebook teachers classrooms path when user exists' do
        ap_user = create(:user, email: "hello+demoteacher+ap@quill.org")
        get :coach_demo
        expect(assigns(:ap_user)).to eq ap_user
        expect(response).to redirect_to scorebook_teachers_classrooms_path
      end
    end

    context 'when demo account does not exist' do
      before do
        allow(Demo::ReportDemoAPCreator).to receive(:create_demo) {|name| create(:user, email: "hello+#{name}+ap@quill.org") }
      end

      it 'sets the user, redirects to scorebook teachers classrooms path when user doesnt exist' do
        expect(Demo::ReportDemoAPCreator).to receive(:create_demo).with("demoteacher")

        get :coach_demo
        expect(response).to redirect_to scorebook_teachers_classrooms_path
      end
    end
  end

  describe '#landing_page' do
    it 'should render the landing page' do
      get :landing_page
      expect(response).to render_template "landing_page"
    end
  end

  describe '#activities_scores_by_classroom' do
    it 'should render the activities scores by classroom' do
      get :activities_scores_by_classroom
      expect(response).to render_template "activities_scores_by_classroom"
    end
  end

  describe '#student_overview' do
    it 'should render the student overview' do
      get :student_overview
      expect(response).to render_template "student_overview"
    end
  end
end
