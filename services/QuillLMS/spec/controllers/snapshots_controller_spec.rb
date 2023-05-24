# frozen_string_literal: true

require 'rails_helper'

describe SnapshotsController, type: :controller do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  context "#count" do
    let(:cache_key) { 'CACHE_KEY' }
    let(:query_name) { 'active-classrooms' }
    let(:timeframe_name) { 'last-30-days' }
    let(:query_class) { controller.class::QUERIES[query_name] }
    let(:now) { DateTime.current }
    let(:current_snapshot_stub) { 'CURRENT' }
    let(:previous_snapshot_stub) { 'PREVIOUS' }

    before do
      allow(controller).to receive(:cache_key).and_return(cache_key)
      allow(DateTime).to receive(:current).and_return(now)
    end

    it 'should return the value in the cache if it is available' do
      payload = {
        "current" => "CURRENT",
        "previous" => "PREVIOUS"
      }

      expect(Rails.cache).to receive(:read).with(cache_key).and_return(payload)

      get :count, params: { query: query_name, timeframe: timeframe_name }

      json_response = JSON.parse(response.body)

      expect(json_response).to eq(payload)
    end

    context 'param variation' do
      let(:previous_timeframe) { 'PREVIOUS_TIMEFRAME' }
      let(:current_timeframe) { 'CURRENT_TIMEFRAME' }
      let(:timeframe_end) { 'TIMEFRAME_END' }

      it 'should trigger a job to cache data if the cache is empty' do
        allow(controller).to receive(:calculate_timeframes).and_return([previous_timeframe, current_timeframe, timeframe_end])
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
          nil,
          nil)

        get :count, params: { query: query_name, timeframe: timeframe_name }

        json_response = JSON.parse(response.body)

        expect(json_response).to eq("message" => "Generating snapshot")
      end

      it 'should include school_ids and grades in the call to the cache worker if they are in params' do
        school_ids = ["1","2","3"]
        grades = ["Kindergarten", "1", "2"]

        allow(controller).to receive(:calculate_timeframes).and_return([previous_timeframe, current_timeframe, timeframe_end])
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
          nil,
          nil)

        get :count, params: { query: query_name, timeframe: timeframe_name, timeframe_custom_start: current_start.to_s, timeframe_custom_end: current_end.to_s }
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

      expect(json_response['timeframes']).to eq([
        {"default"=>true, "name"=>"Last 30 days", "value"=>"last-30-days"},
        {"default"=>false, "name"=>"Last 90 days", "value"=>"last-90-days"},
        {"default"=>false, "name"=>"This month", "value"=>"this-month"},
        {"default"=>false, "name"=>"This month", "value"=>"last-month"},
        {"default"=>false, "name"=>"This year", "value"=>"this-year"},
        {"default"=>false, "name"=>"Last year", "value"=>"last-year"},
        {"default"=>false, "name"=>"All time", "value"=>"all-time"},
        {"default"=>false, "name"=>"Custom", "value"=>"custom"}
      ])
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

  context "#calculate_timeframes" do
    it 'accurately calculates a 30-day timeframe' do
      now = DateTime.current
      end_of_yesterday = now.end_of_day - 1.day
      allow(DateTime).to receive(:current).and_return(now)

      allow(controller).to receive(:snapshot_params).and_return({
        timeframe: 'last-30-days'
      })

      expect(controller.send(:calculate_timeframes)).to eq([
        end_of_yesterday - 60.days,
        end_of_yesterday - 30.days,
        end_of_yesterday
      ])
    end

    it 'accurately calculates a custom timeframe previous_start value' do
      now = DateTime.current.change(usec: 0) # strip fractional seconds to simplify conversion between string and DateTime
      custom_start = now - 10.hours
      custom_end = now - 30.minutes
      timeframe_length = custom_end - custom_start

      allow(controller).to receive(:snapshot_params).and_return({
        timeframe: Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME,
        timeframe_custom_start: custom_start.to_s,
        timeframe_custom_end: custom_end.to_s
      })

      expect(controller.send(:calculate_timeframes)).to eq([
        custom_start - timeframe_length,
        custom_start,
        custom_end
      ])
    end
  end
end
