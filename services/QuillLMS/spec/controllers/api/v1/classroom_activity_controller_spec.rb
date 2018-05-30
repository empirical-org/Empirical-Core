require 'rails_helper'

describe Api::V1::ClassroomActivitiesController, type: :controller do
  let(:other_teacher) { create(:teacher) }
  let(:classroom) {create(:classroom_with_lesson_classroom_activities)}
  let(:teacher) { classroom.owner }

  context '#student_names' do

    it 'does not authenticate a teacher who is not associated with the classroom activity' do
        session[:user_id] = other_teacher.id
        get :student_names, id: classroom.classroom_activities.first.id, format: 'json'
        expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who is associated with the classroom activity classroom' do
        session[:user_id] = teacher.id
        get :student_names, id: classroom.classroom_activities.first.id, format: 'json'
        expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with activity session name key values' do
        session[:user_id] = teacher.id
        get :student_names, id: classroom.classroom_activities.first.id, format: 'json'
        expect(JSON.parse(response.body)['activity_sessions_and_names'].keys.count).to eq(5)
    end

    it 'returns JSON object with student id key values' do
        session[:user_id] = teacher.id
        get :student_names, id: classroom.classroom_activities.first.id, format: 'json'
        expect(JSON.parse(response.body)['student_ids'].keys.count).to eq(5)
    end
  end

  context '#teacher_and_classroom_name' do

    it 'does not authenticate a teacher who is not associated with the classroom activity' do
        session[:user_id] = other_teacher.id
        get :teacher_and_classroom_name, id: classroom.classroom_activities.first.id, format: 'json'
        expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who is associated with the classroom activity classroom' do
        session[:user_id] = teacher.id
        get :teacher_and_classroom_name, id: classroom.classroom_activities.first.id, format: 'json'
        expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with activity session name key values' do
        session[:user_id] = teacher.id
        get :teacher_and_classroom_name, id: classroom.classroom_activities.first.id, format: 'json'
        expect(JSON.parse(response.body)).to eq({"teacher"=>teacher.name, "classroom"=>classroom.name})
    end
  end

  context '#finish_lesson' do

    it 'does not authenticate a teacher who does not own the classroom activity' do
        session[:user_id] = other_teacher.id
        put :finish_lesson, id: classroom.classroom_activities.first.id, json: {concept_results: [], follow_up: true}.to_json, format: 'json'
        expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who does own the classroom activity' do
        session[:user_id] = teacher.id
        put :finish_lesson, id: classroom.classroom_activities.first.id, json: {concept_results: [], follow_up: true}.to_json, format: 'json'
        expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with follow up url if requested' do
        session[:user_id] = teacher.id
        put :finish_lesson, id: classroom.classroom_activities.first.id, json: {concept_results: [], follow_up: true}.to_json, format: 'json'
        follow_up = classroom.classroom_activities.first.assign_follow_up_lesson(false)
        expect(JSON.parse(response.body)).to eq({"follow_up_url"=> "#{ENV['DEFAULT_URL']}/teachers/classroom_activities/#{follow_up&.id}/activity_from_classroom_activity"})
    end

    it 'returns JSON object with link to home if not requested' do
        session[:user_id] = teacher.id
        put :finish_lesson, id: classroom.classroom_activities.first.id, json: {concept_results: [], follow_up: false}.to_json, format: 'json'
        expect(JSON.parse(response.body)).to eq({"follow_up_url"=> "#{ENV['DEFAULT_URL']}"})
    end
  end

  describe '#pin_activity' do
    before do
      session[:user_id] = teacher.id
    end

    it 'should update the pin attribute in the activity' do
      expect(classroom.classroom_activities.first.pinned).to eq false
      get :pin_activity, id: classroom.classroom_activities.first.id
      expect(classroom.reload.classroom_activities.first.pinned).to eq true
    end
  end

  describe '#classroom_teacher_and_coteacher_ids' do
    let(:teacher_ids) { Hash[classroom.teacher_ids.collect {|i| [i, true]}] }

    before do
      session[:user_id] = teacher.id
    end

    it 'should return the teacher ids in the classroom' do
      get :classroom_teacher_and_coteacher_ids, format: :json, id: classroom.classroom_activities.first.id
      expect(response.body).to eq({
        teacher_ids: teacher_ids
      }.to_json)
    end
  end

end
