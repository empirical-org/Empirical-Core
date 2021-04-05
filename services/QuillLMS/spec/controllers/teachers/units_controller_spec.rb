require 'rails_helper'

describe Teachers::UnitsController, type: :controller do
  it { should use_before_action :teacher! }
  it { should use_before_action :authorize! }

  let!(:student) {create(:student)}
  let!(:classroom) { create(:classroom) }
  let!(:students_classrooms) { create(:students_classrooms, classroom: classroom, student: student)}
  let!(:teacher) { classroom.owner }
  let!(:unit) {create(:unit, user: teacher)}
  let!(:unit2) {create(:unit, user: teacher)}
  let!(:classroom_unit) { create(:classroom_unit,
    unit: unit,
    classroom: classroom,
    assigned_student_ids: [student.id]
  )}
  let!(:diagnostic) { create(:diagnostic) }
  let!(:diagnostic_activity) { create(:diagnostic_activity)}
  let!(:unit_activity) { create(:unit_activity, unit: unit, activity: diagnostic_activity, due_date: Time.now )}
  let!(:completed_activity_session) { create(:activity_session, user: student, activity: diagnostic_activity, classroom_unit: classroom_unit)}

  before do
    session[:user_id] = teacher.id
  end

  describe '#create' do
    it 'kicks off a background job' do
      create(:auth_credential, user: teacher)
      expect {
        post(:create,
          classroom_id: classroom.id,
          unit: {
            name: 'A Cool Learning Experience',
            classrooms: [],
            activities: []
          }
        )
      }.to change(AssignActivityWorker.jobs, :size).by(1)
      expect(response.status).to eq(200)
    end
  end

  describe '#prohibited_unit_names' do
    let(:unit_names) { teacher.units.pluck(:name).map(&:downcase) }
    let(:unit_template_names) { UnitTemplate.pluck(:name).map(&:downcase) }

    it 'should render the correct json' do
      get :prohibited_unit_names, format: :json
      expect(response.body).to eq({
          prohibitedUnitNames: unit_names.concat(unit_template_names)
      }.to_json)
    end
  end

  describe '#last_assigned_unit_id' do
    it 'should render the current json' do
      get :last_assigned_unit_id, format: :json
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
        get :lesson_info_for_activity, activity_id: activities.first.id, format: :json
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
        get :lesson_info_for_activity, activity_id: classroom.activities.first.id, format: :json
        expect(response.body).to eq({
          errors: "No activities found"
        }.to_json)
      end
    end

  end

  describe '#diagnostic_units' do

    it 'should render the correct json' do
      get :diagnostic_units

      expected_response = [
        {
          "name" => diagnostic_activity.name,
          "id" => diagnostic_activity.id,
          "individual_assignments" => [
            {
              "assigned_count" => 1,
              "completed_count" => 1,
              "classroom_name" =>  classroom.name,
              "activity_name" =>  diagnostic_activity.name,
              "activity_id" => diagnostic_activity.id,
              "unit_id" => unit.id,
              "unit_name" => unit.name,
              "classroom_id" => classroom.id,
              "assigned_date" =>  unit_activity.created_at
            }
          ],
          "last_assigned" =>  unit_activity.created_at,
          "classes_count" => 1,
          "total_assigned" => 1,
          "total_completed" => 1
        }
      ]
      expect(response.body).to eq(expected_response.to_json)
    end
  end

  describe '#hide' do
    it 'should hide the unit; kick off ArchiveUnitsClassroomUnitsWorker and ResetLessonCacheWorker' do
      expect(ArchiveUnitsClassroomUnitsWorker).to receive(:perform_async).with(unit.id)
      expect(ResetLessonCacheWorker).to receive_message_chain(:new, :perform).with(no_args).with(teacher.id)
      put :hide, id: unit.id
      expect(unit.reload.visible).to eq false
    end
  end

  describe '#index' do
    it 'should return json in the appropriate format' do
      response = get :index, report: false
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['unit_name']).to eq(unit.name)
      expect(parsed_response[0]['activity_name']).to eq(diagnostic_activity.name)
      expect(parsed_response[0]['class_name']).to eq(classroom.name)
      expect(parsed_response[0]['classroom_id']).to eq(classroom.id.to_s)
      expect(parsed_response[0]['activity_classification_id']).to eq(diagnostic_activity.activity_classification_id.to_s)
      expect(parsed_response[0]['classroom_unit_id']).to eq(classroom_unit.id.to_s)
      expect(parsed_response[0]['unit_activity_id']).to eq(unit_activity.id.to_s)
      expect(parsed_response[0]['unit_id']).to eq(unit.id.to_s)
      expect(parsed_response[0]['class_size']).to eq(classroom.students.count.to_s)
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
      response = get :index, report: false
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['number_of_assigned_students']).to eq(original_assigned_student_ids_length)
    end

    # TODO: write a VCR-like test to check when this request returns something other than what we expect.
  end

  describe '#update' do

    it 'sends a 200 status code when a unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: 'Super Unique Unit Name'
                    }
      expect(response.status).to eq(200)
    end

    it 'sends a 422 error code when a non-unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: unit2.name
                    }
      expect(response.status).to eq(422)

    end
  end

  describe '#classrooms_with_students_and_classroom_units' do

    it "returns #get_classrooms_with_students_and_classroom_units when it is passed a valid unit id" do
        get :classrooms_with_students_and_classroom_units, id: unit.id
        res = JSON.parse(response.body)
        expect(res["classrooms"].first["id"]).to eq(classroom.id)
        expect(res["classrooms"].first["name"]).to eq(classroom.name)
        expect(res["classrooms"].first["students"].first['id']).to eq(student.id)
        expect(res["classrooms"].first["students"].first['name']).to eq(student.name)
        expect(res["classrooms"].first["classroom_unit"]).to eq({"id" => classroom_unit.id, "assigned_student_ids" => classroom_unit.assigned_student_ids, "assign_on_join" => true})
    end


    it "sends a 422 error code when it is not passed a valid unit id" do
      get :classrooms_with_students_and_classroom_units, id: Unit.count + 1000
      expect(response.status).to eq(422)
    end

  end

  describe '#update_classroom_unit_assigned_students' do

    it "sends a 200 status code when it is passed valid data" do
      put :update_classroom_unit_assigned_students,
          id: unit.id,
          unit: {
            classrooms: "[{\"id\":#{classroom.id},\"student_ids\":[]}]"
          }
      expect(response.status).to eq(200)
    end

    it "sends a 422 status code when it is passed invalid data" do
      put :update_classroom_unit_assigned_students,
          id: unit.id + 500,
          unit: {
            classrooms: "[{\"id\":#{classroom.id},\"student_ids\":[]}]"
          }
      expect(response.status).to eq(422)
    end

  end

  describe '#update_activities' do

    it "sends a 200 status code when it is passed valid data" do
      activity = unit_activity.activity
      put :update_activities,
          id: unit.id.to_s,
          data: {
            unit_id: unit.id,
            activities_data: [{id: activity.id, due_date: nil}]
          }
      expect(response.status).to eq(200)
    end

    it "sends a 422 status code when it is passed invalid data" do
      activity = unit_activity.activity
      put :update_activities,
          id: unit.id + 500,
          data: {
            unit_id: unit.id + 500,
            activities_data: [{id: activity.id, due_date: nil}]
          }.to_json
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
      get :select_lesson_with_activity_id, activity_id: activity.id
      expect(response).to redirect_to("/teachers/classrooms/activity_planner/lessons_for_activity/#{activity.id}")
    end

    it 'should redirect to the lesson if there is only one lesson' do
      classroom_unit = create(:classroom_unit, classroom: current_user.classrooms_i_own.first)
      unit_activity = create(:unit_activity, unit: classroom_unit.unit, activity: activity)
      get :select_lesson_with_activity_id, activity_id: activity.id
      expect(response).to redirect_to("/teachers/classroom_units/#{classroom_unit.id}/launch_lesson/#{activity.uid}")
    end

    it 'should redirect to a lessons index if there are multiple lessons' do
      unit = create(:unit)
      create_pair(:classroom_unit, unit: unit)
      create(:unit_activity, unit: unit, activity: activity)
      get :select_lesson_with_activity_id, activity_id: activity.id
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
      get :score_info, activity_id: 1
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 0
      expect(json['completed_count']).to eq 0
    end

    it 'basic response' do
      get :score_info, activity_id: activity.id, classroom_unit_id: classroom_unit.id
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 17
      expect(json['completed_count']).to eq 1
    end

    it 'not found response returns 0' do
      get :score_info, activity_id: 999999, classroom_unit_id: 9999999
      json = JSON.parse(response.body)

      expect(json['cumulative_score']).to eq 0
      expect(json['completed_count']).to eq 0
    end
  end
end
