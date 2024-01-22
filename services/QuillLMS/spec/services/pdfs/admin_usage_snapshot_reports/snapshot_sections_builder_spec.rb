# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe SnapshotSectionsBuilder do
      subject { described_class.run(admin_report_filter_selection) }

      let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }

      let(:count_data) { { count: nil } }
      let(:ranking_data) { [{ value: nil, count: nil }] }
      let(:feedback_data) { { type: 'feedback' } }
      let(:processed_data) { [count_data, ranking_data, feedback_data] }

      before do
        allow(Pdfs::AdminUsageSnapshotReports::CountDataInjector).to receive(:run).and_return(count_data)
        allow(Pdfs::AdminUsageSnapshotReports::RankingDataInjector).to receive(:run).and_return(ranking_data)
      end

      it { is_expected.to be_an(Array) }
      it { is_expected.not_to be_empty }
      it { expect(subject.first).to include(:itemGroupings) }

      it 'processes each section and their respective items' do
        subject.each do |section|
          section[:itemGroupings].each do |grouping|
            grouping[:items].each do |item|
              expect(processed_data).to include(item)
            end
          end
        end
      end
    end
  end
end
