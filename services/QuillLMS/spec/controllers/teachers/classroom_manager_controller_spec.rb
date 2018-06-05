require 'rails_helper'

describe Teachers::ClassroomManagerController, type: :controller do

  it { should use_before_filter :teacher_or_public_activity_packs }
  it { should use_before_filter :authorize_owner! }
  it { should use_before_filter :authorize_teacher! }

  describe '#archived_classroom_manager_data' do
    it 'returns all invited, archived, and nonarchived classrooms' do
      teacher = create(:teacher_with_a_couple_active_and_archived_classrooms)
      invitation = create(:pending_coteacher_invitation, invitee_email: teacher.email)
      classroom_invitations = create_pair(:coteacher_classroom_invitation, invitation_id: invitation.id)
      all_classrooms = ClassroomsTeacher.where(user_id: teacher.id).map { |ct| Classroom.unscoped.find ct.classroom_id }
      visible_classrooms = all_classrooms.select(&:visible)
      archived_classrooms = all_classrooms - visible_classrooms
      active_classrooms = classroom_invitations.map { |classroom_invitation|
        {
          classroom_invitation_id: classroom_invitation.id,
          inviter_name: classroom_invitation.invitation.inviter.name,
          classroom_name: classroom_invitation.classroom.name,
          invitation: true
        }
      }
      active_classrooms = sanitize_hash_array_for_comparison_with_sql(active_classrooms) + visible_classrooms.map(&:archived_classrooms_manager)
      session[:user_id] = teacher.id
      get :archived_classroom_manager_data

      save_mock_data(response)

      expect(response.body).to eq({
        active: active_classrooms,
        active_classrooms_i_own: teacher.classrooms_i_own.map{|c| {label: c[:name], value: c[:id]}},
        inactive: archived_classrooms.map(&:archived_classrooms_manager),
        coteachers: teacher.classrooms_i_own_that_have_coteachers,
        pending_coteachers: teacher.classrooms_i_own_that_have_pending_coteacher_invitations,
        my_name: teacher.name
      }.to_json)
    end
  end

  describe '#lesson_planner' do
    let!(:teacher) { create(:classrooms_teacher, user: user) }
    let(:user) { create(:teacher, first_name: "test") }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    context 'when classrooms i teach are empty' do
      before do
        allow(user).to receive(:classrooms_i_teach) { [] }
      end

      it 'should redirect to new teachers classroom path' do
        get :lesson_planner, id: teacher.id
        expect(response).to redirect_to new_teachers_classroom_path
      end
    end

    context 'when classrooms i teach are not empty' do
      it 'should assign the tab, grade, students, last_classroom_name and last_lassroom_id' do
        get :lesson_planner, id: teacher.id, tab: "test tab", grade: "test grade"
        expect(assigns(:tab)).to eq "test tab"
        expect(assigns(:grade)).to eq "test grade"
        expect(assigns(:students)).to eq user.students.any?
        expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
        expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
      end
    end
  end

  describe '#assign_activities' do
    let!(:teacher) { create(:classrooms_teacher, user: user, role: "owner") }
    let(:user) { create(:teacher, first_name: "test") }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    context 'when current user is not staff and has no classrooms i teach' do
      before do
        allow(user).to receive(:classrooms_i_teach) { [] }
      end

      it 'should redirect to new teachers classroom path' do
        get :assign_activities
        expect(response).to redirect_to new_teachers_classroom_path
      end
    end

    context 'when current user is staff or has classrooms i teach' do
      context 'when user is staff' do
        before do
          user.role = "staff"
        end

        it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
          get :assign_activities, tab: "test tab", grade: "test grade"
          expect(assigns(:tab)).to eq "test tab"
          expect(assigns(:grade)).to eq "test grade"
          expect(assigns(:students)).to eq user.students.any?
          expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
          expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
        end
      end

      context 'when user has classrooms i teach' do
        it 'should assign the tab, grade, students, last_classroom_name and last_classroom_id' do
          get :assign_activities, tab: "test tab", grade: "test grade"
          expect(assigns(:tab)).to eq "test tab"
          expect(assigns(:grade)).to eq "test grade"
          expect(assigns(:students)).to eq user.students.any?
          expect(assigns(:last_classroom_id)).to eq user.classrooms_i_teach.last.id
          expect(assigns(:last_classroom_name)).to eq user.classrooms_i_teach.last.name
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
        expect(assigns(:classroom)).to eq teacher.classrooms_i_teach.first
        expect(response).to redirect_to invite_students_teachers_classrooms_path
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
      expect(assigns(:user)).to eq teacher
      expect(assigns(:classrooms)).to eq [classroom]
    end
  end

  describe '#manage_archived_classrooms' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should render the archived classroom manager template' do
      get :manage_archived_classrooms
      expect(response).to render_template("student_teacher_shared/archived_classroom_manager")
    end
  end

  describe '#archived_classroom_manager_data' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
      allow(ActiveRecord::Base.connection).to receive(:execute).and_return([classroom])
    end

    it 'should render the correct json' do
      get :archived_classroom_manager_data
      expect(response.body).to eq({
        active: [classroom],
        active_classrooms_i_own: teacher.classrooms_i_own.map{ |c|
          {
              label: c[:name],
              value: c[:id]
          }
        },
        inactive: [],
        coteachers: teacher.classrooms_i_own_that_have_coteachers,
        pending_coteachers: teacher.classrooms_i_own_that_have_pending_coteacher_invitations,
        my_name: teacher.name
      }.to_json)
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

    context 'when classroom id is not passed' do
      it 'should assign the classrooms and classroom' do
        get :scorebook
        expect(assigns(:classrooms)).to eq ([classroom, classroom1].as_json)
        expect(assigns(:classroom)).to eq (classroom.as_json)
      end
    end
  end

  describe '#dashboard' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    context 'when current user has no classrooms i teach and no archived classrooms and no outstanding coteacher invitation' do
      before do
        allow(teacher).to receive(:classrooms_i_teach) { [] }
        allow(teacher).to receive(:archived_classrooms) { [] }
        allow(teacher).to receive(:has_outstanding_coteacher_invitation?) { false }
      end

      it 'should redirect to new teachers classroom path' do
        get :dashboard
        expect(response).to redirect_to new_teachers_classroom_path
      end
    end

    context 'when current user has classrooms i teach/archived classrooms/has outstanding coteacher invitation' do
      before do
        allow(teacher).to receive(:classrooms_i_teach) { [] }
        allow(teacher).to receive(:archived_classrooms) { [] }
        allow(teacher).to receive(:has_outstanding_coteacher_invitation?) { true }
      end

      it 'should set the firewall test to true' do
        get :dashboard
        expect(assigns(:firewall_test)).to eq true
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
      allow(teacher).to receive(:get_classroom_minis_info) { "some class info" }
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

  describe '#my_account_data' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should render the correct json' do
      get :my_account_data, format: :json
      expect(response.body).to eq(teacher.generate_teacher_account_info.to_json)
    end
  end

  describe '#retreive_google_clasrooms' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { "google response" }
    end

    it 'should render the correct json' do
      get :retrieve_google_classrooms
      expect(response.body).to eq({classrooms: "google response"}.to_json)
    end
  end

  describe '#import_google_students' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { "google response" }
    end

    it 'should kick off the importer' do
      expect(GoogleStudentImporterWorker).to receive(:perform_async).with(teacher.id, 'fake_access_token')
      get :import_google_students, selected_classrooms: [1,2], format: :json
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
end
