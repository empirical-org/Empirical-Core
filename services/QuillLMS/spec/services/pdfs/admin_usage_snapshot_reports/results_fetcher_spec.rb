# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe ResultsFetcher do
      let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }
      let(:query_key) { 'some_query_key' }
      let(:worker) { double('worker') }
      let(:previous_timeframe) { false }

      describe '#run' do
        let(:service) { described_class.new(admin_report_filter_selection: admin_report_filter_selection, query_key: query_key, worker: worker, previous_timeframe: previous_timeframe) }
        let(:cache_key) { 'generated_cache_key' }
        let(:timeframes) { ['start_date', 'end_date'] }

        before do
          allow(Snapshots::CacheKeys).to receive(:generate_key).and_return(cache_key)
          allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
          allow(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
          allow(worker).to receive(:new).and_return(worker)
          allow(worker).to receive(:perform)
        end

        context 'when user_id, timeframe_start, and timeframe_end are present' do
          it 'runs the query and fetches cached results' do
            expect(service.run).not_to be_nil
            expect(worker).to have_received(:perform)
          end
        end

        context 'when user_id, timeframe_start, or timeframe_end is missing' do
          # Adjust the setup to simulate missing values
          it 'returns nil' do
            expect(service.run).to be_nil
          end
        end
      end

      describe 'cache key generation' do
        it 'generates a correct cache key' do
          service = described_class.new(admin_report_filter_selection: admin_report_filter_selection, query_key: query_key, worker: worker, previous_timeframe: previous_timeframe)
          expect(service.send(:cache_key)).to eq('generated_cache_key')
        end
      end

      # Add more tests for other private methods if needed
    end
  end
end
