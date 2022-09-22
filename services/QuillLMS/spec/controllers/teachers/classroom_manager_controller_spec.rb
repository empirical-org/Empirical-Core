# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ClassroomManagerController, type: :controller do
  it { should use_before_action :teacher_or_public_activity_packs }
  it { should use_before_action :authorize_owner! }
  it { should use_before_action :authorize_teacher! }

  describe '#lesson_planner' do
    let!(:teacher) { create(:classrooms_teacher, user: user) }
    let(:user) { create(:teacher, first_name: "test") }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should assign the tab, grade, students, last_classroom_name and last_lassroom_id' do
      get :lesson_planner, params: { id: teacher.id, tab: "test tab", grade: "test grade" }
      expect(assigns(:tab)).to eq "test tab"
      expect(assigns(:grade)).to eq "test grade"
      expect(assigns(:students)).to eq user.students.any?
      expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
      expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
    end
  end

  describe '#assign as a staff w/o classrooms' do
    let(:user) { create(:staff) }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
      get :assign, params: { tab: "test tab", grade: "test grade" }
      expect(response.status).to eq(200)
    end
  end

  describe '#assign' do
    let!(:teacher) { create(:classrooms_teacher, user: user, role: "owner") }
    let(:user) { create(:teacher, first_name: "test") }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    context 'when current user is staff or has classrooms i teach' do
      context 'when user is staff' do
        before do
          user.role = "staff"
        end

        it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
          get :assign, params: { tab: "test tab", grade: "test grade" }
          expect(assigns(:tab)).to eq "test tab"
          expect(assigns(:grade)).to eq "test grade"
          expect(assigns(:students)).to eq user.students.any?
          expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
          expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
        end
      end

      context 'when user has classrooms i teach' do
        it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
          get :assign, params: { tab: "test tab", grade: "test grade" }
          expect(assigns(:tab)).to eq "test tab"
          expect(assigns(:grade)).to eq "test grade"
          expect(assigns(:students)).to eq user.students.any?
          expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
          expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
        end
      end

      describe 'show lessons banner' do
        it 'should be true if the user has not completed any lessons and does not have the milestone' do
          get :assign
          expect(assigns(:show_lessons_banner)).to eq true
        end

        it 'should be false if the user has already completed a lesson' do
          unit = create(:unit, user: user)
          classroom_unit = create(:classroom_unit, unit: unit, classroom: user.classrooms_i_teach.last)
          unit_activity = create(:unit_activity, :lesson_unit_activity, unit: unit)
          classroom_unit_activity_state = create(:classroom_unit_activity_state, classroom_unit: classroom_unit, unit_activity: unit_activity, completed: true)
          get :assign
          expect(assigns(:show_lessons_banner)).to eq false
        end

        it 'should be false if the user already has the acknowledge lessons banner milestone' do
          milestone = create(:acknowledge_lessons_banner)
          user_milestone = create(:user_milestone, milestone: milestone, user: user)
          get :assign
          expect(assigns(:show_lessons_banner)).to eq false
        end
      end

      describe 'show diagnostic banner' do
        it 'should be true if the user has not assigned any diagnostics and does not have the milestone' do
          get :assign
          expect(assigns(:show_diagnostic_banner)).to eq true
        end

        it 'should be false if the user has already assigned a diagnostic' do
          unit = create(:unit, user: user)
          unit_activity = create(:unit_activity, :diagnostic_unit_activity, unit: unit)
          get :assign
          expect(assigns(:show_diagnostic_banner)).to eq false
        end

        it 'should be false if the user already has the acknowledge diagnostic banner milestone' do
          milestone = create(:acknowledge_diagnostic_banner)
          user_milestone = create(:user_milestone, milestone: milestone, user: user)
          get :assign
          expect(assigns(:show_diagnostic_banner)).to eq false
        end
      end

      describe 'show grade level warning' do
        it 'should be true if the user does not have the milestone' do
          get :assign
          expect(assigns(:show_grade_level_warning)).to eq true
        end

        it 'should be false if the user already has the dismiss grade level warning milestone' do
          milestone = create(:dismiss_grade_level_warning)
          user_milestone = create(:user_milestone, milestone: milestone, user: user)
          get :assign
          expect(assigns(:show_grade_level_warning)).to eq false
        end
      end

      describe 'assigned_pre_tests' do
        let!(:starter_post_test) { create(:diagnostic_activity) }
        let!(:intermediate_post_test) { create(:diagnostic_activity) }
        let!(:advanced_post_test) { create(:diagnostic_activity) }
        let!(:starter_pre_test) { create(:diagnostic_activity, id: Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID, follow_up_activity_id: starter_post_test.id) }
        let!(:intermediate_pre_test) { create(:diagnostic_activity, id: Activity::INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID, follow_up_activity_id: intermediate_post_test.id) }
        let!(:advanced_pre_test) { create(:diagnostic_activity, id: Activity::ADVANCED_DIAGNOSTIC_ACTIVITY_ID, follow_up_activity_id: advanced_post_test.id) }
        let!(:unit) { create(:unit, user: user) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: starter_pre_test) }
        let!(:students_classrooms) { create(:students_classrooms, classroom: user.classrooms_i_teach.last) }
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: user.classrooms_i_teach.last, assigned_student_ids: [students_classrooms.student.id]) }
        let!(:activity_session) { create(:activity_session, user: students_classrooms.student, activity: starter_pre_test, classroom_unit: classroom_unit) }


        it 'should be a an array with objects containing the activity id, post test id, and assigned classroom ids' do
          get :assign
          expect(assigns(:assigned_pre_tests)).to include({
            id: starter_pre_test.id,
            post_test_id: starter_post_test.id,
            assigned_classroom_ids: [user.classrooms_i_teach.last.id],
            all_classrooms: [
              {
                id: user.classrooms_i_teach.last.id,
                completed_pre_test_student_ids: [students_classrooms.student.id],
                completed_post_test_student_ids: []
              }
            ]
          },
          {
            id: intermediate_pre_test.id,
            post_test_id: intermediate_post_test.id,
            assigned_classroom_ids: [],
            all_classrooms: [
              {
                id: user.classrooms_i_teach.last.id,
                completed_pre_test_student_ids: [],
                completed_post_test_student_ids: []
              }
            ]
          },
          {
            id: advanced_pre_test.id,
            post_test_id: advanced_post_test.id,
            assigned_classroom_ids: [],
            all_classrooms: [
              {
                id: user.classrooms_i_teach.last.id,
                completed_pre_test_student_ids: [],
                completed_post_test_student_ids: []
              }
            ]
          })
        end
      end

      describe 'checkboxes' do
        let!(:explore_our_library) { create(:explore_our_library) }
        let!(:explore_our_diagnostics) { create(:explore_our_diagnostics) }

        context 'on the base assign route' do

          it 'should create the Explore our library checkbox for the current user' do
            get :assign
            expect(Checkbox.find_by(objective_id: explore_our_library.id, user_id: user.id)).to be
          end

          it 'should not create the Explore our diagnostics checkbox for the current user' do
            get :assign
            expect(Checkbox.find_by(objective_id: explore_our_diagnostics.id, user_id: user.id)).not_to be
          end

        end

        context 'on the /assign/diagnostic route' do

          it 'should create the Explore our library checkbox for the current user' do
            get :assign, params: { tab: 'diagnostic' }
            expect(Checkbox.find_by(objective_id: explore_our_library.id, user_id: user.id)).to be
          end

          it 'should create the Explore our diagnostics checkbox for the current user' do
            get :assign, params: { tab: 'diagnostic' }
            expect(Checkbox.find_by(objective_id: explore_our_diagnostics.id, user_id: user.id)).to be
          end

        end

      end
    end
  end

  describe '#generic_add_students' do
    let(:student) { create(:student) }
    let(:teacher) { create(:teacher) }

    context 'when current user is a teacher' do
      before do
        allow(controller).to receive(:current_user) { teacher }
      end

      it 'should assign the classroom and redirect to profile path' do
        get :generic_add_students
        expect(response).to redirect_to teachers_classrooms_path
      end
    end
  end

  describe '#retrieve_classrooms_for_assigning_activities' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_own) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should return the correct json' do
      json =  teacher.classrooms_i_own.map { |classroom|
        {
            classroom: classroom,
            students: classroom.students.sort_by(&:sorting_name)
        }
      }
      get :retrieve_classrooms_for_assigning_activities, as: :json
      expect(response.body).to eq ({
          classrooms_and_their_students: json
      }).to_json
    end
  end

  describe '#retreive_classrooms_i_teach_for_custom_assigning_activities' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should return the correct json' do
      json =  teacher.classrooms_i_teach.map { |classroom|
        {
            classroom: classroom,
            students: classroom.students.sort_by(&:sorting_name)
        }
      }
      get :retrieve_classrooms_i_teach_for_custom_assigning_activities, as: :json
      expect(response.body).to eq ({
          classrooms_and_their_students: json
      }).to_json
    end
  end

  describe '#classrooms_and_classroom_units_for_activity_share' do
    let(:teacher) { create(:teacher) }
    let(:classroom1) { create(:classroom) }
    let(:classroom2) { create(:classroom) }
    let(:unit1) { create(:unit) }
    let(:unit2) { create(:unit) }
    let!(:classroom_unit1) { create(:classroom_unit, unit_id: unit1.id, visible: true) }
    let!(:classroom_unit2) { create(:classroom_unit, unit_id: unit2.id, visible: true) }
    let(:classrooms_json) {
      teacher.classrooms_i_teach.map { |classroom|
        {
            classroom: classroom,
            students: classroom.students.sort_by(&:sorting_name)
        }
      }
    }
    let(:classrooms) { { classrooms_and_their_students: classrooms_json } }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom1, classroom2] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should render the expected json with first unit id' do
      get :classrooms_and_classroom_units_for_activity_share, params: { unit_id: unit1.id }
      expect(response.body).to eq ({
          classrooms: classrooms,
          classroom_units: [classroom_unit1]
      }).to_json
    end

    it 'should render the expected json with first second id' do
      get :classrooms_and_classroom_units_for_activity_share, params: { unit_id: unit2.id }
      expect(response.body).to eq ({
          classrooms: classrooms,
          classroom_units: [classroom_unit2]
      }).to_json
    end
  end

  describe '#invite_students' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should assign the classrooms and user' do
      get :invite_students
      expect(response).to redirect_to(teachers_classrooms_path)
    end
  end

  describe '#scorebook' do
    let(:teacher) { create(:teacher) }
    let(:classroom1) { create(:classroom) }
    let(:classroom2) { create(:classroom) }
    let(:classroom3) { create(:classroom) }
    let(:classrooms_teacher1) {create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom1.id, order: 1)}
    let(:classrooms_teacher2) {create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom2.id, order: 0)}
    let(:classrooms_teacher3) {create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom3.id, order: 2)}

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(RawSqlRunner).to receive(:execute).and_return([classroom2, classroom1, classroom3])
      allow(controller).to receive(:classroom_teacher!) { true }
    end

    context 'when classroom id is passed' do
      it 'should assign the classrooms (sorted by order) and classroom' do
        get :scorebook, params: { classroom_id: classroom1.id }
        expect(assigns(:classrooms)).to eq ([classroom2, classroom1, classroom3].as_json)
        expect(assigns(:classroom)).to eq (classroom1.as_json)
      end
    end

  end

  describe '#dashboard' do
    let(:teacher) { create(:teacher) }
    let(:blog_post1) { create(:blog_post, featured_order_number: 0)}
    let(:blog_post2) { create(:blog_post, featured_order_number: 1)}
    let(:blog_post3) { create(:blog_post, featured_order_number: 2)}
    let!(:create_a_classroom) { create(:create_a_classroom)}
    let!(:add_students) { create(:add_students)}
    let!(:explore_our_library) { create(:explore_our_library)}
    let!(:explore_our_diagnostics) { create(:explore_our_diagnostics)}
    let!(:create_a_classroom_checkbox) { create(:checkbox, user: teacher, objective: create_a_classroom)}

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(teacher).to receive(:classrooms_i_teach) { [] }
      allow(teacher).to receive(:archived_classrooms) { [] }
      allow(teacher).to receive(:has_outstanding_coteacher_invitation?) { true }
    end

    it 'should set the featured_blog_posts variable to the array of featured blog posts' do
      get :dashboard
      expect(assigns(:featured_blog_posts)).to eq [blog_post1, blog_post2, blog_post3]
    end

    describe 'onboarding checklist' do

      it 'should set the onboarding_checklist variable to an array of objects with values' do
        get :dashboard
        expect(assigns(:objective_checklist)).to eq ([
          {
            name: create_a_classroom.name,
            checked: true,
            link: create_a_classroom.action_url
          },
          {
            name: add_students.name,
            checked: false,
            link: add_students.action_url
          },
          {
            name: explore_our_library.name,
            checked: false,
            link: explore_our_library.action_url
          },
          {
            name: explore_our_diagnostics.name,
            checked: false,
            link: explore_our_diagnostics.action_url
          }
        ])
      end

      context 'when the user does not have existing checkboxes for the latter two objectives but has assigned units' do

        it 'should create the relevant checkboxes and reflect that in the onboarding checklist array' do
          create(:unit, user_id: teacher.id)
          get :dashboard
          expect(Checkbox.find_by(objective: explore_our_library, user: teacher)).to be
          expect(Checkbox.find_by(objective: explore_our_diagnostics, user: teacher)).to be
          expect(assigns(:objective_checklist)).to eq ([
            {
              name: create_a_classroom.name,
              checked: true,
              link: create_a_classroom.action_url
            },
            {
              name: add_students.name,
              checked: false,
              link: add_students.action_url
            },
            {
              name: explore_our_library.name,
              checked: true,
              link: explore_our_library.action_url
            },
            {
              name: explore_our_diagnostics.name,
              checked: true,
              link: explore_our_diagnostics.action_url
            }
          ])
        end

      end

    end
  end

  describe '#students_list' do
    let(:teacher) { create(:teacher_with_a_couple_classrooms_with_a_couple_students_each) }
    let(:classroom) { teacher.classrooms_i_teach.first }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should assign the classroom and render the correct json' do
      get :students_list, params: { id: classroom.id }, as: :json
      expect(assigns(:classroom)).to eq classroom
      expect(response.body).to eq({
        students: classroom.students.order(Arel.sql("substring(users.name, '(?=\s).*') asc, users.name asc"))
      }.to_json)
    end
  end


  describe '#teacher_dashboard_metrics' do
    let!(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should return the summary with no data for no activity' do
      get :teacher_dashboard_metrics, as: :json

      expect(response.status).to eq(200)

      expect(response.body).to eq({
        weekly_assigned_activities_count:  0,
        yearly_assigned_activities_count:  0,
        weekly_completed_activities_count: 0,
        yearly_completed_activities_count: 0
      }.to_json)
    end

    context 'with data' do
      let!(:classrooms_teacher) {create(:classrooms_teacher, user_id: teacher.id)}
      let!(:students) {create_list(:student, 2)}
      let!(:classroom_unit) {create(:classroom_unit, classroom: classrooms_teacher.classroom, assigned_student_ids: students.map { |s| s[:id]})}

      before do
        students.map { |s| create(:students_classrooms, student: s, classroom: classrooms_teacher.classroom) }

        create(:activity_session, :finished, user: students.first, classroom_unit: classroom_unit )
      end

      it 'should return the summary json' do
        get :teacher_dashboard_metrics, as: :json

        expect(response.status).to eq(200)

        expect(response.body).to eq({
          weekly_assigned_activities_count:  2,
          yearly_assigned_activities_count:  2,
          weekly_completed_activities_count: 1,
          yearly_completed_activities_count: 1
        }.to_json)
      end
    end
  end

  describe '#premium' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(teacher).to receive(:trial_days_remaining) { 10 }
      allow(teacher).to receive(:premium_updated_or_created_today?) { true }
      allow(teacher).to receive(:premium_state) { "some subscription" }
    end

    it 'should set the subscription type and return the correct json' do
      get :premium, as: :json
      expect(assigns(:subscription_type)).to eq "some subscription"
      expect(response.body).to eq({
        hasPremium: "some subscription",
        last_subscription_was_trial: nil,
        trial_days_remaining: 10,
        first_day_of_premium_or_trial: true
      }.to_json)
    end
  end

  describe '#classroom_mini' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(teacher).to receive(:classroom_minis_info) { "some class info" }
    end

    it 'should render the correct json' do
      get :classroom_mini, as: :json
      expect(response.body).to eq({
        classes: "some class info"
      }.to_json)
    end
  end

  describe '#teacher_guide' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should assing the checkbox data' do
      get :teacher_guide
      expect(assigns(:checkbox_data)).to eq({
        completed: teacher.checkboxes.map(&:objective_id),
        potential: Objective.all
      })
    end
  end

  describe '#getting_started' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should render the correct json' do
      get :getting_started, as: :json
      expect(response.body).to eq(teacher.getting_started_info.to_json)
    end
  end

  describe '#scores' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(Scorebook::Query).to receive(:run) { [1, 2, 3] }
      allow(Classroom).to receive(:find) { classroom }
    end

    it 'should render the correct json' do
      get :scores, as: :json
      expect(response.body).to eq({
        scores: [1, 2, 3],
        is_last_page: true
      }.to_json)
    end
  end

  describe '#retreive_google_clasrooms' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { "google response" }
    end

    it 'should render the id of the teacher if there is nothing else in the store' do
      get :retrieve_google_classrooms
      expect(response.body).to eq({id: teacher.id, quill_retrieval_processing: true}.to_json)
    end
  end

  describe '#import_google_students' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { "google response" }
    end

    it 'should kick off the importer' do
      create(:google_auth_credential, user: teacher)

      expect(GoogleStudentImporterWorker).to receive(:perform_async)
      put :import_google_students, params: { selected_classroom_ids: [1,2], as: :json }
    end
  end

  describe '#update_my_account' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should give the updated teacher' do
      expect(teacher).to receive(:update_teacher)
      put :update_my_account
    end
  end

  describe '#update_google_classrooms' do
    let(:teacher) { create(:teacher) }
    let(:google_classroom_id1) { 123 }
    let(:google_classroom_id2) { 456 }

    let(:selected_classrooms) { [{ id: google_classroom_id1 }, { id: google_classroom_id2 }] }

    before { allow(controller).to receive(:current_user) { teacher } }

    it 'should return an array with two classrooms' do
     post :update_google_classrooms, params: { selected_classrooms: selected_classrooms }, as: :json

     classrooms = JSON.parse(response.body).deep_symbolize_keys.fetch(:classrooms)

     google_classroom_ids = classrooms.map { |classroom| classroom[:google_classroom_id] }.sort
     expect(google_classroom_ids).to eq [google_classroom_id1, google_classroom_id2]
   end
  end

  describe '#view_demo' do
    let!(:teacher) { create(:teacher) }
    let!(:demo_teacher) { create(:teacher, email: Demo::ReportDemoCreator::EMAIL)}
    let!(:analyzer) { double(:analyzer, track: true) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(Analyzer).to receive(:new) { analyzer }
    end

    it 'will call current_user_demo_id= if the demo account exists' do
      expect(Demo::ReportDemoCreator).to receive(:reset_account).with(demo_teacher)
      expect(controller).to receive(:current_user_demo_id=).with(demo_teacher.id)

      get :view_demo
    end

    it 'will redirect to the profile path' do
      expect(Demo::ReportDemoCreator).to receive(:reset_account).with(demo_teacher)

      get :view_demo
      expect(response).to redirect_to profile_path
    end

    it 'will not call current_user_demo_id= and raise error if demo account does not exist' do
      demo_teacher.destroy
      expect(Demo::ReportDemoCreator).to_not receive(:reset_account)
      expect(controller).not_to receive(:current_user_demo_id=)

      get :view_demo
      expect(JSON.parse(response.body)["errors"]).to eq("Demo Account does not exist")
    end

    it 'will track event' do
      expect(Demo::ReportDemoCreator).to receive(:reset_account).with(demo_teacher)
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::VIEWED_DEMO)

      get :view_demo
    end
  end

  describe '#demo_id' do
    let!(:teacher) { create(:teacher) }
    let!(:demo_teacher) { create(:teacher, email: Demo::ReportDemoCreator::EMAIL)}

    before do
      controller.sign_in(teacher)
    end

    it 'will return the value of session[:demo_id]' do
      get :demo_id, session: {demo_id: demo_teacher.id}
      expect(JSON.parse(response.body)['current_user_demo_id']).to eq(demo_teacher.id)
    end
  end

  describe '#unset_view_demo' do
    let!(:teacher) { create(:teacher) }
    let!(:demo_teacher) { create(:teacher, email: Demo::ReportDemoCreator::EMAIL)}

    before do
      controller.sign_in(teacher)
    end

    it 'will redirect to the redirect param if it exists' do
      expect(Demo::ResetAccountWorker).to receive(:perform_async).with(demo_teacher.id)
      redirect = '/teachers/classes'

      get :unset_view_demo, params: { redirect: redirect }, session: {demo_id: demo_teacher.id}
      expect(response).to redirect_to redirect
    end

    it 'will redirect to the profile path if there is no redirect param' do
      expect(Demo::ResetAccountWorker).to receive(:perform_async).with(demo_teacher.id)

      get :unset_view_demo, session: {demo_id: demo_teacher.id}
      expect(response).to redirect_to profile_path
    end

    it 'will call current_user_demo_id=' do
      expect(Demo::ResetAccountWorker).to receive(:perform_async).with(demo_teacher.id)
      expect(controller).to receive(:current_user_demo_id=).with(nil)

      get :unset_view_demo, session: {demo_id: demo_teacher.id}
    end
  end

  describe '#preview_as_student' do
    let!(:teacher) { create(:teacher) }
    let!(:classroom) { create(:classroom) }
    let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher)}
    let!(:student1) { create(:student)}
    let!(:student2) { create(:student)}
    let!(:students_classrooms) { create(:students_classrooms, student: student1, classroom: classroom)}
    let!(:analyzer) { double(:analyzer, track: true) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(Analyzer).to receive(:new) { analyzer }
    end

    it 'will call preview_student_id= if the student exists and is in one of the teachers classrooms' do
      expect(controller).to receive(:preview_student_id=).with(student1.id.to_s)
      get :preview_as_student, params: { student_id: student1.id }
    end

    it 'will not call preview_student_id= if the student exists and is not in one of the teachers classrooms' do
      expect(controller).not_to receive(:preview_student_id=)
      get :preview_as_student, params: { student_id: student2.id }
    end

    it 'will not call preview_student_id= if the student does not exist' do
      expect(controller).not_to receive(:preview_student_id=)
      get :preview_as_student, params: { student_id: 'random' }
    end

    it 'will redirect to the profile path' do
      get :preview_as_student, params: { student_id: 'random' }
      expect(response).to redirect_to profile_path
    end

    it 'will track event' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::VIEWED_AS_STUDENT)
      get :preview_as_student, params: { student_id: student1.id }
    end
  end

  describe '#unset_preview_as_student' do
    let!(:teacher) { create(:teacher) }

    before do
      controller.sign_in(teacher)
    end

    it 'will redirect to the redirect param if it exists' do
      redirect = '/teachers/classes'
      get :unset_preview_as_student, params: { redirect: redirect }
      expect(response).to redirect_to redirect
    end

    it 'will redirect to the profile path if there is no redirect param' do
      get :unset_preview_as_student
      expect(response).to redirect_to profile_path
    end

    it 'will call preview_student_id=' do
      expect(controller).to receive(:preview_student_id=).with(nil)
      get :unset_preview_as_student
    end

  end

  describe '#activity_feed' do
    let!(:activity_session) {create(:activity_session, completed_at: Time.current) }
    let!(:teacher) { activity_session.teachers.first }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'will respond with the data from the TeacherActivityFeed of a completed activity_session' do
      get :activity_feed

      json = JSON.parse(response.body)

      expect(json['data'].first['id']).to eq (activity_session.id)
    end

  end
end
