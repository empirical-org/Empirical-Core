# frozen_string_literal: true

require 'rails_helper'

# TODO: update specsj
module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe RankingDataInjector do
      let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }

      describe '#run' do
        before do
          allow(SnapshotSectionsBuilder).to receive(:run).and_return({ some_snapshot_data: 'data' })
          # Setup any necessary stubbing for methods like classrooms, grades, schools, teachers, timeframe_name on admin_report_filter_selection
        end

        it 'aggregates filter and snapshot sections data' do
          aggregator = described_class.new(admin_report_filter_selection)
          result = aggregator.run

          expect(result).to have_key(:filter_sections)
          expect(result).to have_key(:snapshot_sections)
          expect(result[:snapshot_sections]).to eq({ some_snapshot_data: 'data' })
          # Verify the filter_sections data
        end
      end
    end
  end
end
