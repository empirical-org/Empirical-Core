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
    let(:query_double) { double }

    context '#perform' do
      let(:timeframe_end) { DateTime.now }
      let(:current_timeframe_start) { timeframe_end - 30.days }
      let(:previous_timeframe_start) { current_timeframe_start - 30.days }
      let(:timeframe) {
        {
          name: timeframe_name,
          previous_start: previous_timeframe_start,
          current_start: current_timeframe_start,
          current_end: timeframe_end
        }
      }

      before do
        stub_const("Snapshots::CacheSnapshotCountWorker::QUERIES", {
          query => query_double
        })

        # Intercept theses calls to isolate them in separate cases
        allow(query_double).to receive(:run)
        allow(Rails.cache).to receive(:write)
        allow(PusherTrigger).to receive(:run)
      end

      it 'should execute queries for both the current and previous timeframes' do
        expect(query_double).to receive(:run).with(user_id, current_timeframe_start, timeframe_end, school_ids, grades)
        expect(query_double).to receive(:run).with(user_id, previous_timeframe_start, current_timeframe_start, school_ids, grades)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should only execute a query for current timeframe if the previous_timeframe_start is nil' do
        expect(query_double).to receive(:run).once
        timeframe[:previous_start] = nil

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should write a payload to cache' do
        previous_snapshot = 'PREVIOUS_SNAPSHOT'
        current_snapshot = 'CURRENT_SNAPSHOT'
        payload = { current: current_snapshot, previous: previous_snapshot }

        expect(query_double).to receive(:run).and_return(current_snapshot, previous_snapshot)
        expect(Rails.cache).to receive(:write).with(cache_key, payload, expires_in: described_class::DEFAULT_CACHE_EXPIRATION)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, grades)
      end

      it 'should send a Pusher notification' do
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
