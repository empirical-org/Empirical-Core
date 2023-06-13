# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe CacheSnapshotCountWorker, type: :worker do
    subject { described_class.new }

    let(:cache_key) { 'CACHE_KEY' }
    let(:query) { 'active-classrooms' }
    let(:user_id) { 123 }
    let(:timeframe_name) { 'last-30-days' }
    let(:school_ids) { [1,2,3] }
    let(:grades) { ['Kindergarten',1,2,3,4] }
    let(:query_double) { double(run: {}) }

    context '#perform' do
      let(:timeframe_end) { DateTime.now }
      let(:current_timeframe_start) { timeframe_end - 30.days }
      let(:previous_timeframe_start) { current_timeframe_start - 30.days }
      let(:timeframe) {
        {
          'name' => timeframe_name,
          'previous_start' => previous_timeframe_start,
          'current_start' => current_timeframe_start,
          'current_end' => timeframe_end
        }
      }

      before do
        stub_const("Snapshots::CacheSnapshotCountWorker::QUERIES", {
          query => query_double
        })
      end

      it 'should execute queries for both the current and previous timeframes' do
        expect(query_double).to receive(:run).with(current_timeframe_start, timeframe_end, school_ids, grades)
        expect(query_double).to receive(:run).with(previous_timeframe_start, current_timeframe_start, school_ids, grades)
        expect(Rails.cache).to receive(:write)
        expect(PusherTrigger).to receive(:run)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should only execute a query for current timeframe if the previous_timeframe_start is nil' do
        expect(query_double).to receive(:run).and_return({}).once
        expect(Rails.cache).to receive(:write)
        expect(PusherTrigger).to receive(:run)
        timeframe['previous_start'] = nil

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should write a payload to cache' do
        previous_count = 100
        previous_timeframe_query_result = { count: previous_count}
        current_count = 50
        current_timeframe_query_result = { count: current_count}
        payload = { current: current_count, previous: previous_count }

        expect(query_double).to receive(:run).and_return(current_timeframe_query_result, previous_timeframe_query_result)
        expect(Rails.cache).to receive(:write).with(cache_key, payload, expires_in: DateTime.current.end_of_day)
        expect(PusherTrigger).to receive(:run)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should send a Pusher notification' do
        expect(Rails.cache).to receive(:write)
        expect(PusherTrigger).to receive(:run).with(user_id, described_class::PUSHER_EVENT, {
          query: query,
          timeframe: timeframe_name,
          school_ids: school_ids,
          grades: grades
        })

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end
    end
  end
end
