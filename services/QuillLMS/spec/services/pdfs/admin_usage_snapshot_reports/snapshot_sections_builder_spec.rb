# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pdfs::AdminUsageSnapshotReports::SnapshotSectionsBuilder do
  let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }

  describe '#run' do
    let(:service) { described_class.new(admin_report_filter_selection) }

    before do
      allow(Pdfs::AdminUsageSnapshotReports::CountDataInjector).to receive(:run).and_return({ injected: 'count_data' })
      allow(Pdfs::AdminUsageSnapshotReports::RankingDataInjector).to receive(:run).and_return({ injected: 'ranking_data' })
      # You may need to setup additional mocks or stubs depending on the implementation details of your injectors
    end

    it 'processes each section and their respective items' do
      result = service.run

      expect(result).not_to be_empty
      expect(result.first[:itemGroupings]).not_to be_empty

      # More detailed tests here, e.g., checking if COUNT items are processed by CountDataInjector
      result.each do |section|
        section[:itemGroupings].each do |grouping|
          grouping[:items].each do |item|
            if item[:type] == 'count'
              expect(item).to include(:injected => 'count_data')
            elsif item[:type] == 'ranking'
              expect(item).to include(:injected => 'ranking_data')
            else
              # Assert for other types or default case
            end
          end
        end
      end
    end
  end
end
