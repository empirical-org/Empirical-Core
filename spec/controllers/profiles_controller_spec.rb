require 'rails_helper'

describe ProfilesController, type: :controller do
  render_views

  describe 'as a student' do
    let(:classroom) {create(:classroom)}
    let(:student) { create(:student) }
    let(:activity) { create(:activity) }
    let(:unit) { create(:unit) }
    let(:classroom_activity) { create(:classroom_activity, activity: activity, unit: unit) }
    let!(:activity_session) { create(:activity_session,
                                      classroom_activity: classroom_activity,
                                      activity: activity,
                                      state: 'unstarted',
                                      user: student) }

    before do
      session[:user_id] = student.id
    end

    it 'loads the student profile' do
      get :show
      expect(response.status).to eq(200)
    end

    context "#student_profile_data" do

      it "returns an error when the current user has no classrooms" do
        get :student_profile_data
        expect(JSON.parse(response.body)['error']).to be
      end

      context 'when the student has a single classroom' do
        it "returns student, classroom, and teacher info when the current user has classrooms" do
          StudentsClassrooms.create(student: student, classroom: classroom)
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(response_body['student']).to eq({
            'name' => student.name,
            'classroom' => {
              'name' => classroom.name,
              'id' => classroom.id,
              'teacher' => {
                'name' => classroom.teacher.name
              }
            }
          })
        end
      end

      context 'when the student is in multiple classrooms' do
        let(:student) { create(:student_in_two_classrooms_with_many_activities) }

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
                'name' => classroom.teacher.name
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
          relevant_classroom.classroom_activities.reverse.each do |classroom_activity|
            activity = classroom_activity.activity
            unit = classroom_activity.unit
            activity_session = classroom_activity.activity_sessions.find_by_user_id(student.id)
            scores_array << {
              'name' => activity.name,
              'description' => activity.description,
              'repeatable' => activity.repeatable,
              'activity_classification_id' => activity.activity_classification_id,
              'unit_id' => unit.id,
              'unit_created_at' => unit.created_at,
              'unit_name' => unit.name,
              'ca_id' => classroom_activity.id,
              'marked_complete' => classroom_activity.completed,
              'activity_id' => activity.id,
              'act_sesh_updated_at' => activity_session&.updated_at,
              'due_date' => classroom_activity.due_date,
              'classroom_activity_created_at' => classroom_activity.created_at,
              'locked' => classroom_activity.locked,
              'pinned' => classroom_activity.pinned,
              'max_percentage' => activity_session&.percentage,
              'resume_link' => activity_session&.state == 'started' ? 1 : 0
            }
          end
          # This sort emulates the sort we are doing in the student_profile_data_sql method.
          sorted_scores = scores_array.sort { |a, b|
            [
              b['pinned'], a['locked'], b['max_percentage'] == nil ? 1.01 : b['max_percentage'], a['unit_created_at'], a['classroom_activity_created_at']
            ] <=> [
              a['pinned'], b['locked'], a['max_percentage'] == nil ? 1.01 : a['max_percentage'], b['unit_created_at'], b['classroom_activity_created_at']
            ]
          }
          expect(scores).to eq(sanitize_hash_array_for_comparison_with_sql(sorted_scores))
        end

        it 'returns next activity session' do
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(response_body['']).to eq()
        end
      end
    end
  end
end
