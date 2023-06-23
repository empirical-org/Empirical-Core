# frozen_string_literal: true

require 'rails_helper'

describe SnapshotsController, type: :controller do
  let(:school) { create(:school) }
  let(:user) { create(:user, administered_schools: [school]) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  context "#actions" do
    let(:cache_key) { 'CACHE_KEY' }
    let(:timeframe_name) { 'last-30-days' }
    let(:now) { DateTime.current }
    let(:current_snapshot_stub) { 'CURRENT' }
    let(:previous_snapshot_stub) { 'PREVIOUS' }
    let(:school_ids) { [school.id.to_s] }
    let(:controller_actions) {
      [
        [:count, 'active-classrooms'],
        [:top_x, 'most-active-schools']
      ]
    }

    before do
      allow(controller).to receive(:cache_key_for_timeframe).and_return(cache_key)
      allow(DateTime).to receive(:current).and_return(now)
    end

    it 'should return the value in the cache assigned to the `results` key if it is available for all actions' do
      cache_payload = {
        "current" => "CURRENT",
        "previous" => "PREVIOUS"
      }
      expected_response = { "results" => cache_payload }

      expect(Rails.cache).to receive(:read).exactly(controller_actions.length).times.with(cache_key).and_return(cache_payload)

      controller_actions.each do |action, query_name|
        get action, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids }

        json_response = JSON.parse(response.body)

        expect(json_response).to eq(expected_response)
      end
    end

    it 'should fine if a cached top_x query is "[]"' do
      cache_payload = []
      expected_response = { "results" => cache_payload }

      expect(Rails.cache).to receive(:read).once.with(cache_key).and_return(cache_payload)

      get :top_x, params: { query: 'most-active-schools', timeframe: timeframe_name, school_ids: school_ids }

      json_response = JSON.parse(response.body)

      expect(json_response).to eq(expected_response)
    end

    context 'authentication' do
      it 'should return a 403 if the current_user is not an admin for all of the school_ids provided' do
        school2 = create(:school)
        expanded_school_ids = school_ids + [school2.id.to_s]

        controller_actions.each do |action, query_name|
          get action, params: { query: query_name, timeframe: timeframe_name, school_ids: expanded_school_ids }

          expect(response.status).to eq(403)
        end
      end
    end

    context 'param validation' do
      it 'should 400 if the timeframe param is not provided' do
        controller_actions.each do |action, query_name|
          get action, params: { query: query_name, school_ids: school_ids }

          expect(response.status).to eq(400)
        end
      end

      it 'should 400 if the timeframe param is not from the TIMEFRAME list' do
        controller_actions.each do |action, query_name|
          get action, params: { query: query_name, timeframe: 'INVALID_TIMEFRAME', school_ids: school_ids }

          expect(response.status).to eq(400)
        end
      end

      it 'should 400 if the school_ids param is not provided' do
        controller_actions.each do |action, query_name|
          get action, params: { query: query_name, timeframe: timeframe_name }

          expect(response.status).to eq(400)
        end
      end

      it 'should 400 if the school_ids param is empty' do
        controller_actions.each do |action, query_name|
          get action, params: { query: query_name, timeframe: timeframe_name, school_ids: [] }

          expect(response.status).to eq(400)
        end
      end

      it 'should 400 if the query name provided is not valid for the endpoint' do
        controller_actions.each do |action, _|
          get action, params: { query: 'INVALID_QUERY_NAME', timeframe: timeframe_name, school_ids: [] }

          expect(response.status).to eq(400)
        end
      end
    end

    context 'param variation' do
      let(:previous_timeframe) { 'PREVIOUS_TIMEFRAME' }
      let(:current_timeframe) { 'CURRENT_TIMEFRAME' }
      let(:timeframe_end) { 'TIMEFRAME_END' }

      it 'should trigger a job to cache data if the cache is empty for counts' do
        query_name = 'active-classrooms'

        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return([previous_timeframe, current_timeframe, timeframe_end])
        expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
        expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(cache_key,
          query_name,
          user.id,
          {
            name: timeframe_name,
            previous_start: previous_timeframe,
            current_start: current_timeframe,
            current_end: timeframe_end
          },
          school_ids,
          nil)

        get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids }

        json_response = JSON.parse(response.body)

        expect(json_response).to eq("message" => "Generating snapshot")
      end

      it 'should trigger a job to cache data if the cache is empty for top_x' do
        query_name = 'most-active-schools'

        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return([previous_timeframe, current_timeframe, timeframe_end])
        expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
        expect(Snapshots::CacheSnapshotTopXWorker).to receive(:perform_async).with(cache_key,
          query_name,
          user.id,
          {
            name: timeframe_name,
            previous_start: previous_timeframe,
            current_start: current_timeframe,
            current_end: timeframe_end
          },
          school_ids,
          nil)

        get :top_x, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids }

        json_response = JSON.parse(response.body)

        expect(json_response).to eq("message" => "Generating snapshot")
      end

      it 'should include school_ids and grades in the call to the cache worker if they are in params' do
        query_name = 'active-classrooms'
        grades = ["Kindergarten", "1", "2"]

        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return([previous_timeframe, current_timeframe, timeframe_end])
        expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
        expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(cache_key,
          query_name,
          user.id,
          {
            name: timeframe_name,
            previous_start: previous_timeframe,
            current_start: current_timeframe,
            current_end: timeframe_end
          },
          school_ids,
          grades)

        get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids, grades: grades }
      end

      it 'should properly calculate custom timeframes' do
        query_name = 'active-classrooms'
        timeframe_name = 'custom'
        current_end = DateTime.now
        timeframe_length = 3.days
        current_start = current_end - timeframe_length

        expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
        expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(cache_key,
          query_name,
          user.id,
          {
            name: timeframe_name,
            previous_start: current_start - timeframe_length,
            current_start: current_start,
            current_end: current_end
          },
          school_ids,
          nil)

        get :count, params: { query: query_name, timeframe: timeframe_name, timeframe_custom_start: current_start.to_s, timeframe_custom_end: current_end.to_s, school_ids: school_ids }
      end
    end
  end

  context "#options" do
    let(:target_grade) { '1' }
    let(:teacher) { create(:teacher, school: school) }
    let(:classroom) { create(:classroom, grade: target_grade) }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, classroom: classroom, role: 'owner') }

    it 'should return all valid timeframe options with names' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['timeframes']).to eq(Snapshots::Timeframes.frontend_options.map(&:stringify_keys))
    end

    it 'should return a list of all schools and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['schools']).to eq([{"id" => school.id, "name" => school.name}])
    end

    it 'should return a static list of grade options' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['grades']).to eq(controller.class::GRADE_OPTIONS.map(&:stringify_keys))
    end

    it 'should return a list of all teachers and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['teachers']).to eq([{"id" => teacher.id, "name" => teacher.name}])
    end

    it 'should return a list of all classrooms and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['classrooms']).to eq([{"id" => classroom.id, "name" => classroom.name}])
    end

    context 'params' do
      let(:excluded_school_id) { school.id + 1 }
      let(:excluded_grade) { '2' }
      let(:excluded_teacher_id) { teacher.id + 1 }

      it 'exclude teachers and classrooms from other schools' do
        get :options, params: { school_ids: [excluded_school_id] }

        json_response = JSON.parse(response.body)

        expect(json_response['teachers']).to eq([])
        expect(json_response['classrooms']).to eq([])
      end

      it 'should pass grades param through to filters' do
        get :options, params: { grades: [excluded_grade] }

        json_response = JSON.parse(response.body)

        expect(json_response['teachers']).to eq([])
        expect(json_response['classrooms']).to eq([])
      end

      it 'should pass teacher_ids param through to filters' do
        get :options, params: { teacher_ids: [excluded_teacher_id] }

        json_response = JSON.parse(response.body)

        expect(json_response['classrooms']).to eq([])
      end
    end
  end
end
