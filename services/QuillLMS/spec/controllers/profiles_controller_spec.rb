require 'rails_helper'

describe ProfilesController, type: :controller do
  describe 'as a student' do
    let!(:classroom) {create(:classroom)}
    let!(:student) { create(:student) }
    let!(:students_classrooms) do
      create(:students_classrooms,
        student: student,
        classroom: classroom
      )
    end
    let!(:other_student) {create(:student)}
    let!(:activity) { create(:activity) }
    let!(:unit) { create(:unit) }
    let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity) }
    let!(:classroom_unit) do
      create(:classroom_unit,
        unit: unit,
        classroom: classroom,
        assigned_student_ids: [student.id]
      )
    end

    before do
      session[:user_id] = student.id
    end

    it 'loads the student profile' do
      get :show
      expect(response.status).to eq(200)
    end

    context '#students_classrooms_json' do
      it 'should return a list of classes the current user is in' do
        student = create(:student_in_two_classrooms_with_many_activities)
        session[:user_id] = student.id
        get :students_classrooms_json
        student_classrooms = []
        student.classrooms.each do |classroom|
          student_classrooms << {
            name: classroom.name,
            teacher: classroom.owner.name,
            id: classroom.id
          }
        end
        expected_response = JSON.parse(response.body)['classrooms']
        expect(expected_response).to eq(sanitize_hash_array_for_comparison_with_sql(student_classrooms))
      end
    end

    context "#student_profile_data" do

      it "returns an error when the current user has no classrooms" do
        session[:user_id] = other_student.id
        get :student_profile_data
        expect(JSON.parse(response.body)['error']).to be
      end

      context 'when the student has a single classroom' do
        it "returns student, classroom, and teacher info when the current user has classrooms" do
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(student.classrooms.count).to eq(1)
          students_classroom = student.classrooms.first
          expect(response_body['student']).to eq({
            'name' => student.name,
            'classroom' => {
              'name' => students_classroom.name,
              'id' => students_classroom.id,
              'teacher' => {
                'name' => students_classroom.owner.name
              }
            }
          })
        end
      end

      context 'when the student is in multiple classrooms' do
        it 'returns correct student, classrooms, and teachers info based on current_classroom_id' do
          classroom = student.classrooms.first
          get :student_profile_data, current_classroom_id: classroom.id
          response_body = JSON.parse(response.body)
          expect(response_body['student']).to eq({
            'name' => student.name,
            'classroom' => {
              'name' => classroom.name,
              'id' => classroom.id,
              'teacher' => {
                'name' => classroom.owner.name
              }
            }
          })
        end

        it 'returns student scores in the correct order' do

          # TODO test pinned and locked sort order (right now, these activities
          # are neither pinned nor locked, so we're not testing that)
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          relevant_classroom = student.classrooms.last
          scores_array = []
          relevant_classroom.classroom_units.each do |classroom_unit|
            unit = classroom_unit.unit
            unit.unit_activities.each do |unit_activity|
              activity = unit_activity.activity
              activity_session = classroom_unit.activity_sessions
                .find_by(user: student, activity: activity)
              state = ClassroomUnitActivityState.find_by(
                classroom_unit: classroom_unit,
                unit_activity: unit_activity
              )

              scores_array << {
                'name' => activity.name,
                'description' => activity.description,
                'repeatable' => activity.repeatable,
                'activity_classification_id' => activity.activity_classification_id,
                'unit_id' => unit.id,
                'unit_created_at' => unit.created_at,
                'unit_name' => unit.name,
                'ca_id' => classroom_unit.id,
                'marked_complete' => state&.completed,
                'activity_id' => activity.id,
                'act_sesh_updated_at' => activity_session&.updated_at,
                'due_date' => unit_activity.due_date,
                'unit_activity_created_at' => classroom_unit.created_at,
                'locked' => state&.locked,
                'pinned' => state&.pinned,
                'max_percentage' => activity_session&.percentage,
                'resume_link' => activity_session&.state == 'started' ? 1 : 0
              }
            end
          end

          # This sort emulates the sort we are doing in the student_profile_data_sql method.
          sorted_scores = scores_array.sort { |a, b|
            [
              b['pinned'], a['locked'], b['max_percentage'] == nil ? 1.01 : b['max_percentage'], a['unit_created_at'], a['unit_activity_created_at']
            ] <=> [
              a['pinned'], b['locked'], a['max_percentage'] == nil ? 1.01 : a['max_percentage'], b['unit_created_at'], b['unit_activity_created_at']
            ]
          }
          expect(scores).to eq(sanitize_hash_array_for_comparison_with_sql(sorted_scores))
        end

        it 'returns next activity session' do
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(response_body['next_activity_session']).to eq(response_body['scores'].first)
        end
      end
    end
  end
end
