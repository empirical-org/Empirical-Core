# frozen_string_literal: true

require 'rails_helper'

describe SnapshotsController, type: :controller do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  context "#actions" do
    let(:cache_key) { 'CACHE_KEY' }
    let(:query_name) { 'active-classrooms' }
    let(:timeframe_name) { 'last-30-days' }
    let(:query_class) { controller.class::QUERIES[query_name] }
    let(:now) { DateTime.current }
    let(:current_snapshot_stub) { 'CURRENT' }
    let(:previous_snapshot_stub) { 'PREVIOUS' }
    let(:school) { create(:school) }
    let(:user) { create(:user, administered_schools: [school]) }
    let(:school_ids) { [school.id.to_s] }

    before do
      allow(controller).to receive(:cache_key_for_timeframe).and_return(cache_key)
      allow(DateTime).to receive(:current).and_return(now)
    end

    it 'should return the value in the cache if it is available' do
      payload = {
        "current" => "CURRENT",
        "previous" => "PREVIOUS"
      }

      expect(Rails.cache).to receive(:read).with(cache_key).and_return(payload)

      get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids }

      json_response = JSON.parse(response.body)

      expect(json_response).to eq(payload)
    end

    context 'authentication' do
      it 'should return a 403 if the current_user is not an admin for all of the school_ids provided' do
        school2 = create(:school)
        expanded_school_ids = school_ids + [school2.id.to_s]

        get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: expanded_school_ids }

        expect(response.status).to eq(403)
      end
    end

    context 'param validation' do
      it 'should 400 if the timeframe param is not provided' do
        get :count, params: { query: query_name, school_ids: school_ids }

        expect(response.status).to eq(400)
      end

      it 'should 400 if the timeframe param is not from the TIMEFRAME list' do
        get :count, params: { query: query_name, timeframe: 'INVALID_TIMEFRAME', school_ids: school_ids }

        expect(response.status).to eq(400)
      end

      it 'should 400 if the school_ids param is not provided' do
        get :count, params: { query: query_name, timeframe: timeframe_name }

        expect(response.status).to eq(400)
      end

      it 'should 400 if the school_ids param is empty' do
        get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: [] }

        expect(response.status).to eq(400)
      end
    end

    context 'param variation' do
      let(:previous_timeframe) { 'PREVIOUS_TIMEFRAME' }
      let(:current_timeframe) { 'CURRENT_TIMEFRAME' }
      let(:timeframe_end) { 'TIMEFRAME_END' }

      it 'should trigger a job to cache data if the cache is empty' do
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

      it 'should include school_ids and grades in the call to the cache worker if they are in params' do
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
    let(:schools_options) {
      [
        {"id" => 1, "name" => "School 1"},
        {"id" => 2, "name" => "School 2"}
      ]
    }

    before do
      allow(Snapshots::SchoolsOptionsQuery).to receive(:run).and_return(schools_options)
    end

    it 'should return all valid timeframe options with names' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['timeframes']).to eq(Snapshots::Timeframes.frontend_options.map(&:stringify_keys))
    end

    it 'should return a list of all schools and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['schools']).to eq(schools_options)
    end

    it 'should return a static list of grade options' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['grades']).to eq(controller.class::GRADE_OPTIONS.map(&:stringify_keys))
    end
  end
end
