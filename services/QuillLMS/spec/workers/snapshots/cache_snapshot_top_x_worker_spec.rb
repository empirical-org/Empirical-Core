# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe CacheSnapshotTopXWorker, type: :worker do
    subject { described_class.new }

    let(:cache_key) { 'CACHE_KEY' }
    let(:query) { 'most-active-schools' }
    let(:user_id) { 123 }
    let(:timeframe_name) { 'last-30-days' }
    let(:school_ids) { [1,2,3] }
    let(:grades) { ['Kindergarten',1,2,3,4] }
    let(:teacher_ids) { [3,4,5] }
    let(:classroom_ids) { [6,7] }
    let(:filters) do
      {
        grades: grades,
        teacher_ids: teacher_ids,
        classroom_ids: classroom_ids
      }
    end
    let(:filters_with_string_keys) do
      {
        "grades" => grades,
        "teacher_ids" => teacher_ids,
        "classroom_ids" => classroom_ids
      }
    end
    let(:query_double) { double(run: {}) }

    it { expect { described_class::QUERIES.values }.not_to raise_error }

    context '#perform' do
      let(:timeframe_end) { DateTime.now }
      let(:current_timeframe_start) { timeframe_end - 30.days }
      let(:previous_timeframe_start) { current_timeframe_start - 30.days }
      let(:timeframe) {
        {
          'name' => timeframe_name,
          'previous_start' => previous_timeframe_start.to_s,
          'current_start' => current_timeframe_start.to_s,
          'current_end' => timeframe_end.to_s
        }
      }
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

      before do
        stub_const("Snapshots::CacheSnapshotTopXWorker::QUERIES", {
          query => query_double
        })
      end

      it 'should execute a query for the timeframe' do
        expect(query_double).to receive(:run).with(expected_query_args)
        expect(Rails.cache).to receive(:write)
        expect(SendPusherMessageWorker).to receive(:perform_async)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, filters)
      end

      context 'serialization/deserialization' do
        it 'should deserialize timeframes back into DateTimes' do
          allow(SendPusherMessageWorker).to receive(:perform_async)
          Sidekiq::Testing.inline! do
            expect(query_double).to receive(:run).with(expected_query_args)

            described_class.perform_async(cache_key, query, user_id, timeframe, school_ids, filters)
          end
        end
      end

      context "params with string keys" do
        it 'should execute a query for the timeframe' do
          expect(query_double).to receive(:run).with(expected_query_args)
          expect(Rails.cache).to receive(:write)
          expect(SendPusherMessageWorker).to receive(:perform_async)

          subject.perform(cache_key, query, user_id, timeframe, school_ids, filters_with_string_keys)
        end
      end

      it 'should write a payload to cache' do
        cache_ttl = 1
        payload = [{ value: 'Some Thing', count: 10 }]

        expect(subject).to receive(:cache_expiry).and_return(cache_ttl)

        expect(query_double).to receive(:run).and_return(payload)
        expect(Rails.cache).to receive(:write).with(cache_key, payload, expires_in: cache_ttl)
        expect(SendPusherMessageWorker).to receive(:perform_async)

        subject.perform(cache_key, query, user_id, timeframe, school_ids, filters)
      end

      it 'should send a Pusher notification' do
        hash_options = [
          query,
          timeframe_name,
          school_ids.join('-'),
          grades&.join('-'),
          teacher_ids&.join('-'),
          classroom_ids&.join('-')
        ].join('-')

        expect(Rails.cache).to receive(:write)
        expect(SendPusherMessageWorker).to receive(:perform_async).with(user_id, described_class::PUSHER_EVENT, Digest::MD5.hexdigest(hash_options))

        subject.perform(cache_key, query, user_id, timeframe, school_ids, filters_with_string_keys)
      end
    end
  end
end
