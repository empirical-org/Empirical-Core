# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe ResultsFetcher do
      subject { described_class.run(admin_report_filter_selection:, query_key:, worker:, previous_timeframe:) }

      let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }
      let(:query_key) { 'some_query_key' }
      let(:worker) { double('worker') }
      let(:previous_timeframe) { false }
      let(:cache_key) { 'generated_cache_key' }
      let(:cached_results) { { cached: 'results' } }

      before { allow(Snapshots::CacheKeys).to receive(:generate_key).and_return(cache_key) }

      context 'when user_id is not present' do
        before { allow(admin_report_filter_selection).to receive(:user_id).and_return(nil) }

        it { is_expected.to be_nil }
      end

      context 'when cached results exists' do
        before do
          allow(Rails.cache)
            .to receive(:read)
            .with(cache_key)
            .and_return(cached_results)
            .once
        end

        it { is_expected.to eq cached_results }
      end

      context 'when cached results do not exist' do
        let(:worker_instance) { double('worker_instance') }

        before do
          allow(Rails.cache).to receive(:read).with(cache_key).and_return(nil, cached_results)
          allow(worker).to receive(:new).and_return(worker_instance)
          allow(worker_instance).to receive(:perform).and_return(true)
        end

        it { is_expected.to eq cached_results }
      end
    end
  end
end
