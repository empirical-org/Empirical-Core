require 'rails_helper'

describe Teachers::ClassroomManagerController, type: :controller do
  it { should use_before_filter :teacher_or_public_activity_packs }
  it { should use_before_filter :authorize_owner! }
  it { should use_before_filter :authorize_teacher! }

  describe '#lesson_planner' do
    let!(:teacher) { create(:classrooms_teacher, user: user) }
    let(:user) { create(:teacher, first_name: "test") }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should assign the tab, grade, students, last_classroom_name and last_lassroom_id' do
      get :lesson_planner, id: teacher.id, tab: "test tab", grade: "test grade"
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
      get :assign, tab: "test tab", grade: "test grade"
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
          get :assign, tab: "test tab", grade: "test grade"
          expect(assigns(:tab)).to eq "test tab"
          expect(assigns(:grade)).to eq "test grade"
          expect(assigns(:students)).to eq user.students.any?
          expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
          expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
        end
      end

      context 'when user has classrooms i teach' do
        it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
          get :assign, tab: "test tab", grade: "test grade"
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
            get :assign, { tab: 'diagnostic' }
            expect(Checkbox.find_by(objective_id: explore_our_library.id, user_id: user.id)).to be
          end

          it 'should create the Explore our diagnostics checkbox for the current user' do
            get :assign, { tab: 'diagnostic' }
            expect(Checkbox.find_by(objective_id: explore_our_diagnostics.id, user_id: user.id)).to be
          end

        end

      end
    end
  end

  describe '#generic_add_students' do
    let(:student) { create(:student) }
    let(:teacher) { create(:teacher) }

    # the before filter authorize_teacher! redirects the user so this branch is never traversed
    # context 'when current is not a teacher' do
    #   before do
    #     allow(controller).to receive(:current_user) { student }
    #   end
    #
    #   it 'should redirect to profile path' do
    #     get :generic_add_students
    #     expect(response).to redirect_to profile_path
    #   end
    # end

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
      get :retrieve_classrooms_for_assigning_activities, format: :json
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
      get :retrieve_classrooms_i_teach_for_custom_assigning_activities, format: :json
      expect(response.body).to eq ({
          classrooms_and_their_students: json
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
    let(:classroom) { create(:classroom) }
    let(:classroom1) { create(:classroom) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(ActiveRecord::Base.connection).to receive(:execute).and_return([classroom, classroom1])
      allow(controller).to receive(:classroom_teacher!) { true }
    end

    context 'when classroom id is passed' do
      it 'should assign the classrooms and classroom' do
        get :scorebook, classroom_id: classroom1.id
        expect(assigns(:classrooms)).to eq ([classroom, classroom1].as_json)
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
      get :students_list, id: classroom.id, format: :json
      expect(assigns(:classroom)).to eq classroom
      expect(response.body).to eq({
        students: classroom.students.order("substring(users.name, '(?=\s).*') asc, users.name asc"),
      }.to_json)
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
      get :classroom_mini, format: :json
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
      get :getting_started, format: :json
      expect(response.body).to eq(teacher.getting_started_info.to_json)
    end
  end

  describe '#scores' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(Scorebook::Query).to receive(:run) { [1, 2, 3] }
    end

    it 'should render the correct json' do
      get :scores, format: :json
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
      create(:auth_credential, user: teacher)

      expect(GoogleStudentImporterWorker).to receive(:perform_async)
      put :import_google_students, selected_classroom_ids: [1,2], format: :json
    end
  end

  describe '#dashboard_query' do
    let(:teacher) { create(:teacher) }

    before do
      allow(Dashboard).to receive(:queries) { "queries" }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should render the dashboard query' do
      get :dashboard_query
      expect(response.body).to eq({performanceQuery: "queries"}.to_json)
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

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should return empty array with no classrooms' do
      expect(GoogleIntegration::Classroom::Creators::Classrooms).to receive(:run)
      classroom_json = [{id: 1}, {id: 2}].to_json
      post :update_google_classrooms, selected_classrooms: classroom_json, format: :json

      expect(response.body).to eq({classrooms: []}.to_json)
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
      get :preview_as_student, student_id: student1.id
    end

    it 'will not call preview_student_id= if the student exists and is not in one of the teachers classrooms' do
      expect(controller).not_to receive(:preview_student_id=)
      get :preview_as_student, student_id: student2.id
    end

    it 'will not call preview_student_id= if the student does not exist' do
      expect(controller).not_to receive(:preview_student_id=)
      get :preview_as_student, student_id: 'random'
    end

    it 'will redirect to the profile path' do
      get :preview_as_student, student_id: 'random'
      expect(response).to redirect_to profile_path
    end

    it 'will track event' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::VIEWED_AS_STUDENT)
      get :preview_as_student, student_id: student1.id
    end
  end

  describe '#unset_preview_as_student' do
    let!(:teacher) { create(:teacher) }

    before do
      controller.sign_in(teacher)
    end

    it 'will redirect to the redirect param if it exists' do
      redirect = '/teachers/classes'
      get :unset_preview_as_student, redirect: redirect
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
    let!(:activity_session) {create(:activity_session, completed_at: Time.now) }
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
