# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ClassroomUnitsController, type: :controller do
  let(:other_teacher) { create(:teacher) }
  let(:classroom) { create(:classroom) }
  let(:students) { create_list(:student, 5) }
  let(:classroom_unit) do
    create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: students.map(&:id)
    )
  end
  let(:activity) { create(:lesson_activity, :with_follow_up) }
  let!(:activity_sessions) do
    students.map do |student|
      create(:activity_session,
        classroom_unit: classroom_unit,
        activity: activity,
        user: student
      )
    end
  end
  let(:teacher) { classroom.owner }

  context '#student_names' do
    it 'does not authenticate a teacher who is not associated with the classroom activity' do
      session[:user_id] = other_teacher.id
      get :student_names, params: { activity_id: activity.uid, classroom_unit_id: classroom_unit.id }, as: :json
      expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who is associated with the classroom activity classroom' do
      session[:user_id] = teacher.id
      get :student_names, params: { activity_id: activity.uid, classroom_unit_id: classroom_unit.id }, as: :json
      expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with activity session name key values' do
      session[:user_id] = teacher.id
      get :student_names, params: { activity_id: activity.uid, classroom_unit_id: classroom_unit.id }, as: :json
      expect(JSON.parse(response.body)['activity_sessions_and_names'].keys.count)
        .to eq(5)
    end

    it 'returns JSON object with student id key values' do
      session[:user_id] = teacher.id
      get :student_names, params: { activity_id: activity.uid, classroom_unit_id: classroom_unit.id }, as: :json
      expect(JSON.parse(response.body)['student_ids'].keys.count).to eq(5)
    end
  end

  context '#teacher_and_classroom_name' do
    it 'does not authenticate a teacher who is not associated with the classroom activity' do
      session[:user_id] = other_teacher.id
      get :teacher_and_classroom_name, params: { classroom_unit_id: classroom_unit.id }, as: :json
      expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who is associated with the classroom activity classroom' do
      session[:user_id] = teacher.id
      get :teacher_and_classroom_name, params: { classroom_unit_id: classroom_unit.id }, as: :json
      expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with activity session name key values' do
      session[:user_id] = teacher.id
      get :teacher_and_classroom_name, params: { classroom_unit_id: classroom_unit.id }, as: :json
      expect(JSON.parse(response.body))
        .to eq({"teacher"=>teacher.name, "classroom"=>classroom.name})
    end
  end

  context '#finish_lesson' do
    let(:follow_up_activity) { create(:activity) }
    let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }

    it 'does not authenticate a teacher who does not own the classroom activity' do
      session[:user_id] = other_teacher.id
      put :finish_lesson,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id,
          concept_results: [],
          follow_up: true
        },
        as: :json

      expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who does own the classroom activity' do
      session[:user_id] = teacher.id
      concept_result = create(:concept_result)

      put :finish_lesson,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id,
          concept_results: [],
          follow_up: true
        },
        as: :json

      expect(response.status).not_to eq(303)
    end

    it 'sends the appropriate methods to ActivitySession' do
      expect(ActivitySession).to receive(:mark_all_activity_sessions_complete).with(match_array(activity_sessions), {})
      expect(ActivitySession).to receive(:save_concept_results).with(match_array(activity_sessions), [])
      expect(ActivitySession).to receive(:delete_activity_sessions_with_no_concept_results).with(match_array(activity_sessions))
      expect(ActivitySession).to receive(:save_timetracking_data_from_active_activity_session).with(match_array(activity_sessions))
      session[:user_id] = teacher.id
      put :finish_lesson,
        params: {
          activity_id: activity.id,
          classroom_unit_id: classroom_unit.id,
          concept_results: [],
          follow_up: true
        },
        as: :json
    end

    it 'returns JSON object with follow up url if requested' do
      session[:user_id] = teacher.id
      put :finish_lesson,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id,
          concept_results: [],
          follow_up: true
        },
        as: :json

      expected_url = "#{ENV['DEFAULT_URL']}/activity_sessions/classroom_units/" \
                     "#{classroom_unit.id}/activities/#{activity.follow_up_activity_id}"

      expect(JSON.parse(response.body))
        .to eq({ "follow_up_url" => expected_url })
    end

    it 'returns JSON object with link to home if not requested' do
      session[:user_id] = teacher.id
      put :finish_lesson,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id,
          concept_results: [],
          follow_up: false
        },
        as: :json

      expect(JSON.parse(response.body)).to eq({"follow_up_url"=> (ENV['DEFAULT_URL']).to_s})
    end

    it 'saves ConceptResults related to the ActivitySession' do
      concept = create(:concept)

      session[:user_id] = teacher.id

      concept_result_payload = {
        "concept_id": concept.uid,
        "question_type": "lessons-slide",
        "metadata": {
          "activity_session_uid": activity_sessions.first.uid,
          "correct": 1,
          "directions": "",
          "prompt": "<p>What is one reason to use time order joining words in your writing instead of using two shorter sentences?</p>",
          "answer": "It makes causal relationships more obvious.",
          "attemptNumber": 1,
          "questionNumber": 1
        },
        "activity_session_uid": activity_sessions.first.uid
      }
      concept_results_payload = [concept_result_payload, concept_result_payload]

      # The "twice" here is a convenience because we're passing two identical concept_result payloads to the controller.
      # In normal operation, these would be different payloads, so we'd expect this worker
      # to receive multiple calls with different payloads.  But this is shorter to write,
      # and less cluttered to read
      expect(SaveActivitySessionConceptResultsWorker).to receive(:perform_async).with(
        concept_id: concept.id,
        question_type: concept_result_payload[:question_type],
        activity_session_id: activity_sessions.first.id,
        metadata: concept_result_payload[:metadata],
      ).twice

      put :finish_lesson,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id,
          concept_results: concept_results_payload,
          follow_up: false
        },
        as: :json
    end
  end

  describe '#unpin_and_lock_activity' do
    let(:unit_activity) { UnitActivity.find_by(unit: classroom_unit.unit, activity: activity) }
    let!(:classroom_unit_activity_state) do
      create(:classroom_unit_activity_state,
        classroom_unit: classroom_unit,
        unit_activity: unit_activity,
        pinned: true,
        locked: false
      )
    end

    before { session[:user_id] = teacher.id }


    it 'should unpin and lock the state of classroom unit activity' do
      put :unpin_and_lock_activity,
        params: {
          activity_id: activity.uid,
          classroom_unit_id: classroom_unit.id
        },
        as: :json

      expect(classroom_unit_activity_state.reload).to have_attributes(
        pinned: false,
        locked: true
      )
    end
  end

  describe '#classroom_teacher_and_coteacher_ids' do
    let(:teacher_ids) { classroom.teacher_ids.collect {|i| [i, true]}.to_h }

    before { session[:user_id] = teacher.id }

    it 'should return the teacher ids in the classroom' do
      get :classroom_teacher_and_coteacher_ids, params: { classroom_unit_id: classroom_unit.id }, as: :json
      expect(response.body).to eq({ teacher_ids: teacher_ids }.to_json)
    end
  end

end
