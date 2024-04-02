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
    let(:teacher_ids) { [3,4,5] }
    let(:classroom_ids) { [6,7] }
    let(:previous_timeframe) { nil }
    let(:filters) do
      {
        grades: grades,
        teacher_ids: teacher_ids,
        classroom_ids: classroom_ids
      }
    end
    let(:filters_with_string_keys) { filters.stringify_keys }

    let(:query_double) { double(run: {}) }

    it { expect { described_class::QUERIES.values }.not_to raise_error }

    context '#perform' do
      let(:perform) { subject.perform(cache_key, query, user_id, timeframe, school_ids, filters, previous_timeframe) }
      let(:timeframe_end) { DateTime.now }
      let(:current_timeframe_start) { timeframe_end - 30.days }
      let(:custom_timeframe_start) { nil }
      let(:custom_timeframe_end) { nil }
      let(:timeframe) {
        {
          'name' => timeframe_name,
          'timeframe_start' => current_timeframe_start.to_s,
          'timeframe_end' => timeframe_end.to_s,
          'custom_start' => custom_timeframe_start&.to_s,
          'custom_end' => custom_timeframe_end&.to_s
        }
      }
      let(:expected_pusher_event) { "#{described_class::CURRENT_TIMEFRAME_PUSHER_EVENT}:#{query}" }
      let(:timeframe_pusher_payload) { { custom_start: custom_timeframe_start&.to_s, custom_end: custom_timeframe_end&.to_s } }

      let(:expected_query_args) {
        {
          timeframe_start: current_timeframe_start,
          timeframe_end: timeframe_end,
          school_ids: school_ids,
          grades: grades,
          teacher_ids: teacher_ids,
          classroom_ids: classroom_ids
        }
      }
      let(:hashed_payload) do
        PayloadHasher.run([
          query,
          timeframe_name,
          custom_timeframe_start,
          custom_timeframe_end,
          school_ids,
          grades,
          teacher_ids,
          classroom_ids
        ].flatten)
      end

      before do
        stub_const("Snapshots::CacheSnapshotCountWorker::QUERIES", {
          query => query_double
        })
      end

      it 'should execute the query for the current timeframe' do
        expect(query_double).to receive(:run).with(expected_query_args)
        expect(Rails.cache).to receive(:write)
        expect(SendPusherMessageWorker).to receive(:perform_async).with(anything, expected_pusher_event, anything)

        perform
      end

      context 'when previous_timeframe param is passed with a value' do
        let(:previous_timeframe) { 'true' }
        let(:expected_pusher_event) { "#{described_class::PREVIOUS_TIMEFRAME_PUSHER_EVENT}:#{query}" }

        it do
          expect(SendPusherMessageWorker).to receive(:perform_async).with(anything, expected_pusher_event, anything)

          perform
        end
      end

      context 'serialization/deserialization' do
        it 'should deserialize timeframes back into DateTimes' do
          allow(SendPusherMessageWorker).to receive(:perform_async)
          Sidekiq::Testing.inline! do
            expect(query_double).to receive(:run).with(expected_query_args)

            described_class.perform_async(cache_key, query, user_id, timeframe, school_ids, filters, previous_timeframe)
          end
        end
      end

      context "params with string keys" do
        it 'should execute the query for the timeframe' do
          expect(query_double).to receive(:run).with(expected_query_args)
          expect(Rails.cache).to receive(:write)
          expect(SendPusherMessageWorker).to receive(:perform_async)

          subject.perform(cache_key, query, user_id, timeframe, school_ids, filters_with_string_keys, previous_timeframe)
        end
      end

      it 'should write a payload to cache' do
        cache_ttl = 1
        previous_count = 100
        current_count = 50
        current_timeframe_query_result = { count: current_count}
        payload = { count: current_count }

        expect(subject).to receive(:cache_expiry).and_return(cache_ttl)

        expect(query_double).to receive(:run).and_return(current_timeframe_query_result)
        expect(Rails.cache).to receive(:write).with(cache_key, payload, expires_in: cache_ttl)
        expect(SendPusherMessageWorker).to receive(:perform_async)

        perform
      end

      it 'should send a Pusher notification' do
        expect(Rails.cache).to receive(:write)
        expect(SendPusherMessageWorker).to receive(:perform_async).with(user_id, expected_pusher_event, hashed_payload)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, filters_with_string_keys, previous_timeframe)
      end

      context 'custom timeframe params' do
        let(:custom_timeframe_start) { current_timeframe_start }
        let(:custom_timeframe_end) { timeframe_end }

        it do
          expect(SendPusherMessageWorker).to receive(:perform_async).with(user_id, expected_pusher_event, anything)

          subject.perform(cache_key, query, user_id, timeframe, school_ids, filters_with_string_keys, previous_timeframe)
        end
      end

      context 'slow query reporting' do
        let(:start) { 0 }
        let(:finish) { described_class::TOO_SLOW_THRESHOLD }

        before { allow(LongProcessNotifier).to receive(:current_time).and_return(start, finish) }

        it do
          allow(PusherTrigger).to receive(:run)
          expect(ErrorNotifier).to receive(:report)
          perform
        end

        context 'query takes less time than threshold' do
          let(:finish) { start }

          it do
            allow(PusherTrigger).to receive(:run)
            expect(ErrorNotifier).not_to receive(:report)
            perform
          end
        end
      end
    end
  end
end
