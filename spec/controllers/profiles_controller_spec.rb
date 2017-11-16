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

        it 'returns student scores' do
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          relevant_classroom = student.classrooms.last
          expect(scores.length).to eq(relevant_classroom.classroom_activities.length)
          # binding.pry

          # scores_array =
          # {
          #   "name"=>"Silver Fairy Tale Activity",
          #   "description"=>"This is the description for the 'Silver Fairy Tale Activity' activity.",
          #   "repeatable"=>"t",
          #   "activity_classification_id"=>"107",
          #   "unit_id"=>"4",
          #   "unit_created_at"=>"2017-11-15 22:00:09.43224",
          #   "unit_name"=>"Unit 4",
          #   "ca_id"=>"7",
          #   "marked_complete"=>"f"
          #    "activity_id"=>nil,
          #    "act_sesh_updated_at"=>nil,
          #    "due_date"=>nil,
          #    "classroom_activity_created_at"=>"2017-11-15 22:00:09.505332",
          #    "locked"=>"f",
          #    "pinned"=>"f",
          #    "max_percentage"=>nil,
          #    "resume_link"=>"0"
          #  }
          # expect(scores).to eq(scores_array)
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
