# frozen_string_literal: true

require 'rails_helper'

describe Teachers::UnitsController, type: :controller do
  let!(:student) {create(:student)}
  let!(:classroom) { create(:classroom) }
  let!(:students_classrooms) { create(:students_classrooms, classroom: classroom, student: student)}
  let!(:teacher) { classroom.owner }
  let!(:unit) {create(:unit, user: teacher)}
  let!(:unit2) {create(:unit, user: teacher)}

  let!(:classroom_unit) do
    create(:classroom_unit,
     unit: unit,
     classroom: classroom,
     assigned_student_ids: [student.id]
   )
  end

  let!(:classroom_unit2) do
    create(:classroom_unit,
     unit: unit2,
     classroom: classroom,
     assigned_student_ids: [student.id]
   )
  end

  let!(:diagnostic) { create(:diagnostic) }
  let!(:diagnostic_activity) { create(:diagnostic_activity)}
  let!(:unit_activity) { create(:unit_activity, unit: unit, activity: diagnostic_activity, due_date: Time.current )}

  let!(:completed_activity_session) do
    create(:activity_session,
      user: student,
      activity: diagnostic_activity,
      classroom_unit: classroom_unit
    )
  end

  before { session[:user_id] = teacher.id }

  it { should use_before_action :teacher! }
  it { should use_before_action :authorize! }

  describe '#create' do
    it 'kicks off a background job' do
      create(:auth_credential, user: teacher)

      expect {
        post :create,
          params: {
            classroom_id: classroom.id,
            unit: {
              name: 'A Cool Learning Experience',
              classrooms: [],
              activities: []
            }
          },
          as: :json
      }.to change(AssignActivityWorker.jobs, :size).by(1)
      expect(response.status).to eq(200)
    end
  end

  describe '#prohibited_unit_names' do
    let(:unit_names) { teacher.units.pluck(:name).map(&:downcase) }
    let(:unit_template_names) { UnitTemplate.pluck(:name).map(&:downcase) }

    it 'should render the correct json' do
      get :prohibited_unit_names, as: :json
      expect(JSON.parse(response.body)['prohibitedUnitNames']).to match_array(unit_names.concat(unit_template_names))
    end

    it 'should not include unit names from archived classrooms' do
      classroom2 = create(:classroom, visible: false)
      create(:classrooms_teacher, classroom: classroom2, user: teacher, role: 'owner')
      unit3 = create(:unit, user: teacher)
      create(:classroom_unit,
        unit: unit3,
        classroom: classroom2,
        assigned_student_ids: [student.id]
      )

      get :prohibited_unit_names, as: :json
      expect(JSON.parse(response.body)['prohibitedUnitNames']).not_to include(unit3.name.downcase)
    end
  end

  describe '#last_assigned_unit_id' do
    it 'should render the current json' do
      get :last_assigned_unit_id, as: :json
      expect(response.body).to eq({
        id: Unit.where(user: teacher).last.id,
        referral_code: teacher.referral_code
      }.to_json)
    end
  end

  describe '#lesson_info_for_activity' do
    context 'when activities present' do
      let(:activities) { classroom.activities }

      before do
        allow(controller).to receive(:get_classroom_units_for_activity) { activities }
      end

      it 'should render the correct json' do
        get :lesson_info_for_activity, params: { activity_id: activities.first.id }, as: :json
        expect(response.body).to eq({
          classroom_units: activities,
          activity_name: Activity.select('name').where("id = #{activities.first.id}")
        }.to_json)
      end
    end

    context 'when activities not present' do
      before do
        allow(controller).to receive(:get_classroom_units_for_activity) { [] }
      end

      it 'should render the correct json' do
        get :lesson_info_for_activity, params: { activity_id: classroom.activities.first.id }, as: :json
        expect(response.body).to eq({
          errors: "No activities found"
        }.to_json)
      end
    end

  end

  describe '#diagnostic_units' do
    let(:expected_response) do
      [
        {
          name: classroom.name,
          id: classroom.id,
          diagnostics: [
            name: diagnostic_activity.name,
            pre: {
              assigned_student_ids: classroom_unit.assigned_student_ids,
              classroom_name: classroom.name,
              activity_name: diagnostic_activity.name,
              activity_id: diagnostic_activity.id,
              unit_id: unit.id,
              unit_name: unit.name,
              classroom_id: classroom.id,
              assigned_date: unit_activity.created_at,
              post_test_id: diagnostic_activity.follow_up_activity_id,
              classroom_unit_id: classroom_unit.id,
              completed_count: 1,
              assigned_count: 1
            }
          ]
        }
      ]
    end

    it 'should render the correct json' do
      get :diagnostic_units

      expect(response.body).to eq(expected_response.to_json)
    end

    it 'should successfully render both fresh data and cached data' do
      expect(controller).to receive(:diagnostics_organized_by_classroom).once.with(any_args).and_call_original
      2.times do
        get :diagnostic_units

        expect(response.status).to eq(200)
        expect(response.body).to eq(expected_response.to_json)
      end
    end

    it 'should not double-count a user for completed_count if they completed the activity twice' do
      create(:activity_session,
        user: student,
        activity: diagnostic_activity,
        classroom_unit: classroom_unit
      )

      get :diagnostic_units

      expect(response.body).to eq(expected_response.to_json)
    end
  end

  describe '#hide' do
    it 'should hide the unit; kick off ArchiveUnitsClassroomUnitsWorker and ResetLessonCacheWorker' do
      expect(ArchiveUnitsClassroomUnitsWorker).to receive(:perform_async).with(unit.id)
      expect(ResetLessonCacheWorker).to receive_message_chain(:new, :perform).with(no_args).with(teacher.id)
      put :hide, params: { id: unit.id }
      expect(unit.reload.visible).to eq false
    end
  end

  describe '#index' do
    it 'should return json in the appropriate format' do
      response = get :index, params: { report: false }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['unit_name']).to eq(unit.name)
      expect(parsed_response[0]['activity_name']).to eq(diagnostic_activity.name)
      expect(parsed_response[0]['class_name']).to eq(classroom.name)
      expect(parsed_response[0]['classroom_id']).to eq(classroom.id)
      expect(parsed_response[0]['activity_classification_id']).to eq(diagnostic_activity.activity_classification_id)
      expect(parsed_response[0]['classroom_unit_id']).to eq(classroom_unit.id)
      expect(parsed_response[0]['unit_activity_id']).to eq(unit_activity.id)
      expect(parsed_response[0]['unit_id']).to eq(unit.id)
      expect(parsed_response[0]['class_size']).to eq(classroom.students.count)
      expect(parsed_response[0]['number_of_assigned_students']).to eq(classroom_unit.assigned_student_ids.length)
      expect(parsed_response[0]['activity_uid']).to eq(diagnostic_activity.uid)
      expect(DateTime.parse(parsed_response[0]['due_date']).to_i).to eq(unit_activity.due_date.to_i)
      expect(parsed_response[0]['unit_created_at'].to_i).to eq(unit.created_at.to_i)
      expect(parsed_response[0]['unit_activity_created_at'].to_i).to eq(unit_activity.created_at.to_i)
    end

    it 'should only return a number of assigned students that are actually in the class' do
      original_assigned_student_ids_length = classroom_unit.assigned_student_ids.length
      extra_assigned_student_ids = classroom_unit.assigned_student_ids.push(300)
      classroom_unit.update(assigned_student_ids: extra_assigned_student_ids)
      response = get :index, params: { report: false }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['number_of_assigned_students']).to eq(original_assigned_student_ids_length)
    end

    # TODO: write a VCR-like test to check when this request returns something other than what we expect.
  end

  describe '#update' do

    it 'sends a 200 status code when a unique name is sent over' do
      put :update, params: { id: unit.id, unit: {
                      name: 'Super Unique Unit Name'
                    } }
      expect(response.status).to eq(200)
    end

    it 'sends a 422 error code when a non-unique name is sent over' do
      put :update, params: { id: unit.id, unit: {
                      name: unit2.name
                    } }
      expect(response.status).to eq(422)

    end
  end

  describe '#classrooms_with_students_and_classroom_units' do

    it "returns #get_classrooms_with_students_and_classroom_units when it is passed a valid unit id" do
      get :classrooms_with_students_and_classroom_units, params: { id: unit.id }
      res = JSON.parse(response.body)
      expect(res["classrooms"].first["id"]).to eq(classroom.id)
      expect(res["classrooms"].first["name"]).to eq(classroom.name)
      expect(res["classrooms"].first["students"].first['id']).to eq(student.id)
      expect(res["classrooms"].first["students"].first['name']).to eq(student.name)
      expect(res["classrooms"].first["classroom_unit"]).to eq({"id" => classroom_unit.id, "assigned_student_ids" => classroom_unit.assigned_student_ids, "assign_on_join" => true})
    end


    it "sends a 422 error code when it is not passed a valid unit id" do
      get :classrooms_with_students_and_classroom_units, params: { id: Unit.count + 1000 }
      expect(response.status).to eq(422)
    end

  end

  describe '#update_classroom_unit_assigned_students' do

    it "sends a 200 status code when it is passed valid data" do
      put :update_classroom_unit_assigned_students, params: { id: unit.id, unit: {
            classrooms: "[{\"id\":#{classroom.id},\"student_ids\":[]}]"
          } }
      expect(response.status).to eq(200)
    end

    it "sends a 422 status code when it is passed invalid data" do
      put :update_classroom_unit_assigned_students, params: { id: unit.id + 500, unit: {
            classrooms: "[{\"id\":#{classroom.id},\"student_ids\":[]}]"
          } }
      expect(response.status).to eq(422)
    end

  end

  describe '#update_activities' do

    it "sends a 200 status code when it is passed valid data" do
      activity = unit_activity.activity
      put :update_activities, params: { id: unit.id.to_s, data: {
            unit_id: unit.id,
            activities_data: [{id: activity.id, due_date: nil}]
          } }
      expect(response.status).to eq(200)
    end

    it "sends a 422 status code when it is passed invalid data" do
      activity = unit_activity.activity
      put :update_activities, params: { id: unit.id + 500, data: {
            unit_id: unit.id + 500,
            activities_data: [{id: activity.id, due_date: nil}]
          }.to_json }
      expect(response.status).to eq(422)
    end
  end

  describe '#select_lesson_with_activity_id' do
    let!(:activity) { create(:lesson_activity) }

    before do
      ClassroomUnit.destroy_all
      UnitActivity.destroy_all
      session['user_id'] = classroom_unit.classroom.owner.id
    end

    it 'should redirect to a lessons index if there are no lessons' do
      get :select_lesson_with_activity_id, params: { activity_id: activity.id }
      expect(response).to redirect_to("/teachers/classrooms/activity_planner/lessons_for_activity/#{activity.id}")
    end

    it 'should redirect to the lesson if there is only one lesson' do
      classroom_unit = create(:classroom_unit, classroom: current_user.classrooms_i_own.first)
      unit_activity = create(:unit_activity, unit: classroom_unit.unit, activity: activity)
      get :select_lesson_with_activity_id, params: { activity_id: activity.id }
      expect(response).to redirect_to("/teachers/classroom_units/#{classroom_unit.id}/launch_lesson/#{activity.uid}")
    end

    it 'should redirect to a lessons index if there are multiple lessons' do
      unit = create(:unit)
      create_pair(:classroom_unit, unit: unit)
      create(:unit_activity, unit: unit, activity: activity)
      get :select_lesson_with_activity_id, params: { activity_id: activity.id }
      expect(response).to redirect_to("/teachers/classrooms/activity_planner/lessons_for_activity/#{activity.id}")
    end
  end

  describe '#score_info' do
    let!(:activity) {create(:activity)}
    let!(:classroom_unit) {create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student.id])}
    let!(:activity_session) {create(:activity_session,
      activity: activity,
      classroom_unit: classroom_unit,
      is_final_score: true,
      percentage: 0.17,
      visible: true
    )}

    it 'no classroom_unit_id should return empty hash' do
      get :score_info, params: { activity_id: 1 }
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 0
      expect(json['completed_count']).to eq 0
    end

    it 'basic response' do
      get :score_info, params: { activity_id: activity.id, classroom_unit_id: classroom_unit.id }
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 17
      expect(json['completed_count']).to eq 1
    end

    it 'not found response returns 0' do
      get :score_info, params: { activity_id: 999999, classroom_unit_id: 9999999 }
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 0
      expect(json['completed_count']).to eq 0
    end
  end
end
