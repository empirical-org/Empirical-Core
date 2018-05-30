require 'rails_helper'

describe Teachers::ProgressReportsController do
  it { should use_before_action :authorize! }
  it { should use_before_action :set_vary_header }

  let(:teacher) { create(:teacher) }

  before do
    allow(controller).to receive(:current_user) { teacher }
  end

  describe '#demo' do
    context 'when name not given' do
      context 'when demo account exists' do
        let!(:user) { create(:user, email: "hello+demoteacher@quill.org" ) }

        it 'should use the hello+demot\eacher@quill account and redirect to scorebook teachers classrooms path' do
          get :demo
          expect(assigns(:user)).to eq user
          expect(response).to redirect_to scorebook_teachers_classrooms_path
        end
      end

      context 'when demo account does not exist' do
        before do
          allow(Demo::ReportDemoDestroyer).to receive(:destroy_demo) { true }
          allow(Demo::ReportDemoCreator).to receive(:create_demo) {|name| create(:user, email: "hello+#{name}@quill.org") }
        end

        it 'should destroy the current demo and create a new demo' do
          expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with("demoteacher")
          expect(Demo::ReportDemoCreator).to receive(:create_demo).with("demoteacher")
          get :demo
        end
      end
    end

    context 'when name is given' do
      context 'when demo account exists' do
        let!(:user) { create(:user, email: "hello+test@quill.org" ) }

        it 'should use the hello+test@quill account and redirect to scorebook teachers classrooms path' do
          get :demo, name: "test"
          expect(assigns(:user)).to eq User.find_by_email 'hello+test@quill.org'
          expect(response).to redirect_to scorebook_teachers_classrooms_path
        end

        context 'when when name is demoaccount' do
          let!(:user) { create(:user, email: "hello+demoaccount@quill.org" ) }

          it 'should redirect to teachers_progress_reports_concepts_students_path path' do
            get :demo, name: "demoaccount"
            expect(response).to redirect_to teachers_progress_reports_concepts_students_path
          end
        end

        context 'when name is admin demo' do
          let!(:user) { create(:user, email: "hello+admin_demo@quill.org" ) }

          it 'should redirect to profile path' do
            get :demo, name: "admin_demo"
            expect(response).to redirect_to profile_path
          end
        end
      end

      context 'when demo account does not exist' do
        before do
          allow(Demo::ReportDemoDestroyer).to receive(:destroy_demo) { true }
          allow(Demo::ReportDemoCreator).to receive(:create_demo) {|name| create(:user, email: "hello+#{name}@quill.org") }
        end

        it 'should destroy the current demo and create a new demo' do
          expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with("test")
          expect(Demo::ReportDemoCreator).to receive(:create_demo).with("test")
          get :demo, name: "test"
        end
      end
    end
  end

  describe '#admin_demo' do
    context 'when name given' do
      context 'when user exists' do
        let!(:user) { create(:user, email: "hello+demoadmin-test@quill.org") }

        it 'should set the user and redirect to teacher_admin_dashboard path' do
          get :admin_demo, name: "test"
          expect(assigns(:admin_user)).to eq user
        end
      end

      context 'when user does not exist' do
        before do
          allow(Demo::AdminReportDemoCreator).to receive(:create_demo) { |name| create(:user, email: "hello+demoadmin-#{name}@quill.org" )  }
        end

        it 'should set the user and redirect to teacher_admin_dashboard path' do
          expect(Demo::AdminReportDemoCreator).to receive(:create_demo).with("test", "test", "hello+demoadmin-test@quill.org")
          get :admin_demo, name: "test"
        end
      end
    end

    context 'when name not given' do
      context 'when user exists' do
        let!(:user) { create(:user, email: "hello+demoadmin-admindemoschool@quill.org") }

        it 'should set the user and redirect to teacher_admin_dashboard path' do
          get :admin_demo
          expect(assigns(:admin_user)).to eq user
        end
      end

      context 'when user does not exist' do
        before do
          allow(Demo::AdminReportDemoCreator).to receive(:create_demo) { |name, school_name, email| create(:user, email: email)  }
        end

        it 'should set the user and redirect to teacher_admin_dashboard path' do
          expect(Demo::AdminReportDemoCreator).to receive(:create_demo).with("Admin Demo School", "admindemoschool", "hello+demoadmin-admindemoschool@quill.org")
          get :admin_demo
        end
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