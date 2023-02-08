# frozen_string_literal: true

require 'rails_helper'

describe TeachersController, type: :controller do

  context "with teacher" do
    let!(:school) { create(:school) }
    let!(:teacher) { create(:teacher, :with_classrooms_students_and_activities, school: school) }
    let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
    let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}

    before { allow(controller).to receive(:current_user) { teacher } }

    describe '#admin_dashboard' do
      it 'redirect to profile if not admin' do
        get :admin_dashboard
        expect(response).to redirect_to profile_path
      end

      it 'render admin dashboard' do
        user = create(:admin)
        allow(controller).to receive(:current_user) { user }
        get :admin_dashboard
        expect(response).to render_template('admin')
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

    describe '#lessons_info_for_dashboard_mini' do
      let!(:lessons) { create(:lesson_classification) }
      let!(:lesson_activity1) { create(:lesson_activity) }
      let!(:lesson_activity2) { create(:lesson_activity) }

      context 'the teacher has not assigned any lessons' do
        it 'returns an empty array' do
          get :lessons_info_for_dashboard_mini
          expect(response.body).to eq({ units: [] }.to_json)
        end
      end

      context 'the teacher has assigned a lesson that has been finished' do
        let!(:unit) { create(:unit) }
        let!(:classroom) { create(:classroom_with_a_couple_students) }
        let!(:classroom_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher) }
        let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: classroom.students.ids)}
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: lesson_activity1)}
        let!(:classroom_unit_activity_state) { create(:classroom_unit_activity_state, unit_activity: unit_activity, classroom_unit: classroom_unit, completed: true)}

        it 'returns an empty array' do
          get :lessons_info_for_dashboard_mini
          expect(response.body).to eq({ units: [] }.to_json)
        end
      end

      context 'the teacher has assigned lessons that have not been finished' do
        let!(:unit) { create(:unit) }
        let!(:classroom) { create(:classroom_with_a_couple_students) }
        let!(:classroom_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher) }
        let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: classroom.students.ids)}
        let!(:unit_activity1) { create(:unit_activity, unit: unit, activity: lesson_activity1)}
        let!(:unit_activity2) { create(:unit_activity, unit: unit, activity: lesson_activity2)}
        let!(:classroom_unit_activity_state1) { create(:classroom_unit_activity_state, unit_activity: unit_activity1, classroom_unit: classroom_unit, completed: false)}
        let!(:classroom_unit_activity_state2) { create(:classroom_unit_activity_state, unit_activity: unit_activity2, classroom_unit: classroom_unit, completed: false)}

        it 'returns an array with both lessons activities in it in reverse order of creation' do
          get :lessons_info_for_dashboard_mini
          expect(response.body).to eq({ units: [
            {
              classroom_name: classroom.name,
              activity_name: lesson_activity2.name,
              activity_id: lesson_activity2.id,
              classroom_unit_id: classroom_unit.id,
              classroom_id: classroom.id,
              supporting_info: lesson_activity2.supporting_info
            },
            {
              classroom_name: classroom.name,
              activity_name: lesson_activity1.name,
              activity_id: lesson_activity1.id,
              classroom_unit_id: classroom_unit.id,
              classroom_id: classroom.id,
              supporting_info: lesson_activity1.supporting_info
            }
          ]}.to_json)
        end
      end

    end

    describe '#diagnostic_info_for_dashboard_mini' do
      let!(:diagnostic) { create(:diagnostic) }
      let!(:diagnostic_activity1) { create(:diagnostic_activity) }
      let!(:diagnostic_activity2) { create(:diagnostic_activity, follow_up_activity_id: diagnostic_activity1.id) }

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
        let!(:unit_activity1) { create(:unit_activity, unit: unit, activity: diagnostic_activity1)}
        let!(:unit_activity2) { create(:unit_activity, unit: unit, activity: diagnostic_activity2)}

        it 'returns a row for each diagnostic' do
          get :diagnostic_info_for_dashboard_mini
          expected_response = [
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 0,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity2.name,
              activity_id: diagnostic_activity2.id,
              post_test_id: diagnostic_activity2.follow_up_activity_id,
              pre_test_id: nil,
              unit_id: unit.id,
              classroom_id: classroom.id
            },
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 0,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity1.name,
              activity_id: diagnostic_activity1.id,
              post_test_id: nil,
              pre_test_id: diagnostic_activity2.id,
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
        let!(:unit_activity1) { create(:unit_activity, unit: unit, activity: diagnostic_activity1)}
        let!(:unit_activity2) { create(:unit_activity, unit: unit, activity: diagnostic_activity2)}
        let!(:activity_session1) { create(:activity_session, user: classroom.students[0], classroom_unit: classroom_unit, activity: unit_activity1.activity)}
        let!(:activity_session2) { create(:activity_session, user: classroom.students[1], classroom_unit: classroom_unit, activity: unit_activity2.activity)}

        it 'returns a row for each diagnostic' do
          get :diagnostic_info_for_dashboard_mini
          expected_response = [
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 1,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity2.name,
              activity_id: diagnostic_activity2.id,
              post_test_id: diagnostic_activity2.follow_up_activity_id,
              pre_test_id: nil,
              unit_id: unit.id,
              classroom_id: classroom.id
            },
            {
              assigned_count: classroom.students.ids.length,
              completed_count: 1,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity1.name,
              activity_id: diagnostic_activity1.id,
              post_test_id: nil,
              pre_test_id: diagnostic_activity2.id,
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

    before do
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

        expect(response).to redirect_to('/session/new')
      end
    end

    describe '#classrooms_i_teach_with_students' do

      it 'should redirect to login' do
        get :classrooms_i_teach_with_students

        expect(response).to redirect_to('/session/new')
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
