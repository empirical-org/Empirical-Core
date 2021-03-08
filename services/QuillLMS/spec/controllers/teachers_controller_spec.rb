require 'rails_helper'

describe TeachersController, type: :controller do

  context "with teacher" do
    let!(:school) { create(:school) }
    let!(:teacher) { create(:teacher, :with_classrooms_students_and_activities, school: school) }
    let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
    let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

  # describe '#create' do
  #   let!(:school) { create(:school) }
  #
  #   context 'when schools admins is found' do
  #     let!(:schools_admins) { create(:schools_admins, school: school, user: teacher) }
  #
  #     context 'when teacher is found' do
  #       context 'when schools users exists' do
  #         let!(:schools_users) { create(:schools_users, user: teacher, school: school) }
  #
  #         it 'should render the teacher is already registered to school' do
  #           post :create, id: school.id, teacher: { first_name: "some_name", last_name: "last_name", email: teacher.email }
  #           expect(response.body).to eq({message: "some_name last_name is already registered to #{school.name}"})
  #         end
  #       end
  #
  #       context 'when school users do not exist' do
  #         it 'should render that email has been sent to teacher and kick off join school email worker' do
  #           expect(JoinSchoolEmailWorker).to receive(:perform_async).with(teacher.id, school.id)
  #           post :create, id: school.id, teacher: { first_name: "some_name", last_name: "last_name", email: teacher.email }
  #           expect(response.body).to eq({message: "An email has been sent to #{teacher.email}"}.to_json)
  #         end
  #       end
  #     end
  #
  #     context 'when teacher is not found'  do
  #       it 'should create a new teacher and jointhem to the school' do
  #         expect(AccountCreatedEmailWorker).to receive(:perform_async)
  #         post :create, id: school.id, teacher: { first_name: "some_name", last_name: "last_name", email: "test@email.com" }
  #         expect(response.body).to eq({message: "An email has been to test@email.com asking them to set up their account."}.to_json)
  #       end
  #     end
  #   end
  #
  #   context 'when schools admins is not found' do
  #     it 'should render something went wrong' do
  #       post :create, id: school.id, teacher: { first_name: "some_name", last_name: "last_name", email: "test@email.com" }
  #       expect(response.body).to eq( {errors: 'Something went wrong. If this problem persists, please contact us at hello@quill.org'}.to_json)
  #       expect(response.code).to eq"422"
  #     end
  #   end
  # end

    describe '#admin_dashboard' do
      it 'render admin dashboard' do
        get :admin_dashboard
        expect(response).to redirect_to profile_path
      end
      it 'render admin dashboard' do
        user = create(:user)
        user.schools_admins.create
        allow(controller).to receive(:current_user) { user }
        get :admin_dashboard
        expect(response).to render_template('admin')
      end
    end

    describe '#unlink' do
      it 'unlinks teacher from school' do
        expect(SchoolsUsers.find_by(user: teacher)).to be
        expect($redis).to receive(:del).with("SERIALIZED_ADMIN_USERS_FOR_#{teacher.id}")
        post :unlink, teacher_id: teacher.id
        expect(SchoolsUsers.find_by(user: teacher)).not_to be
      end

      it 'returns 400 response if cannot unlink' do
        user2 = create(:teacher, school: nil)
        expect(SchoolsUsers.find_by(user: user2)).not_to be
        post :unlink, teacher_id: user2.id
        expect(response.status).to eq(400)
      end
    end

    describe '#current_user_json' do
      it 'render current user json' do
        get :current_user_json
        expect(response.body).to eq teacher.to_json
      end
    end

    describe '#classrooms_i_teach_with_students' do

      it 'returns the classrooms with students of the current user' do
        get :classrooms_i_teach_with_students
        teacher.classrooms_i_teach_with_students.each do |classroom|
          expect(response.body).to include(classroom.to_json)
        end
      end

      it 'returns the classrooms the current user owns' do
        get :classrooms_i_teach_with_students
        expect(response.body).to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
      end
    end

    describe '#classrooms_i_own_with_students' do

      it 'returns the classrooms with students the current user owns' do
        get :classrooms_i_own_with_students
        expect(response.body).to eq({classrooms: teacher.classrooms_i_own_with_students}.to_json)
      end

      it 'does not return the classrooms with students the current user coteaches' do
        get :classrooms_i_own_with_students
        expect(response.body).not_to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
      end
    end

    describe '#diagnostic_info_for_dashboard_mini' do
      let!(:diagnostic) { create(:diagnostic) }
      let!(:diagnostic_activity_1) { create(:diagnostic_activity) }
      let!(:diagnostic_activity_2) { create(:diagnostic_activity) }

      context 'the teacher has not assigned any diagnostics' do
        it 'returns an empty array' do
          get :diagnostic_info_for_dashboard_mini
          expect(response.body).to eq({ units: [] }.to_json)
        end
      end

      context 'the teacher has assigned some diagnostics but nobody has completed them' do
        let!(:unit) { create(:unit) }
        let!(:classroom) { create(:classroom_with_a_couple_students) }
        let!(:classroom_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher) }
        let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: classroom.students.ids)}
        let!(:unit_activity_1) { create(:unit_activity, unit: unit, activity: diagnostic_activity_1)}
        let!(:unit_activity_2) { create(:unit_activity, unit: unit, activity: diagnostic_activity_2)}

        it 'returns a row for each diagnostic' do
          get :diagnostic_info_for_dashboard_mini
          expected_response = [
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 0,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity_2.name,
              activity_id: diagnostic_activity_2.id,
              unit_id: unit.id,
              classroom_id: classroom.id
            },
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 0,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity_1.name,
              activity_id: diagnostic_activity_1.id,
              unit_id: unit.id,
              classroom_id: classroom.id
            }
          ]
          expect(response.body).to eq({units: expected_response}.to_json)
        end
      end

      context 'the teacher has assigned some diagnostics that have been completed' do
        let!(:unit) { create(:unit) }
        let!(:classroom) { create(:classroom_with_a_couple_students) }
        let!(:classroom_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher) }
        let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: classroom.students.ids)}
        let!(:unit_activity_1) { create(:unit_activity, unit: unit, activity: diagnostic_activity_1)}
        let!(:unit_activity_2) { create(:unit_activity, unit: unit, activity: diagnostic_activity_2)}
        let!(:activity_session_1) { create(:activity_session, user: classroom.students[0], classroom_unit: classroom_unit, activity: unit_activity_1.activity)}
        let!(:activity_session_2) { create(:activity_session, user: classroom.students[1], classroom_unit: classroom_unit, activity: unit_activity_2.activity)}

        it 'returns a row for each diagnostic' do
          get :diagnostic_info_for_dashboard_mini
          expected_response = [
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 1,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity_2.name,
              activity_id: diagnostic_activity_2.id,
              unit_id: unit.id,
              classroom_id: classroom.id
            },
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 1,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity_1.name,
              activity_id: diagnostic_activity_1.id,
              unit_id: unit.id,
              classroom_id: classroom.id
            }
          ]
          expect(response.body).to eq({units: expected_response}.to_json)
        end
      end

    end
  end

  context "without user" do

    before(:each) do
      allow(controller).to receive(:current_user) { nil }
    end

    describe '#classrooms_i_teach_with_lessons' do

      it 'should respond' do

        get :classrooms_i_teach_with_lessons

        expect(response.status).to eq(200)
      end
    end

    describe '#classrooms_i_own_with_students' do

      it 'should redirect to login' do
        get :classrooms_i_own_with_students

        response.should redirect_to '/session/new'
      end
    end

    describe '#classrooms_i_teach_with_students' do

      it 'should redirect to login' do
        get :classrooms_i_teach_with_students

        response.should redirect_to '/session/new'
      end
    end

    describe '#diagnostic_info_for_dashboard_mini' do

      it 'should respond' do

        get :diagnostic_info_for_dashboard_mini

        expect(response.status).to eq(200)
        expect(response.body).to eq({ units: [] }.to_json)
      end
    end
  end
end
