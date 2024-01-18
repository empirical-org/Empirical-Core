# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe CountDataInjector do
      subject { described_class.run(admin_report_filter_selections:, item:) }

      let(:item) { { queryKey:, type: } }
      let(:type) { 'count' }
      let(:queryKey) { 'totalStudents' }
      let(:admin_report_filter_selections) { create(:admin_report_filter_selection, :with_default_filters) }

      it { expect(subject).to eq(item) }
    end
  end
end

# require 'rails_helper'

# RSpec.describe Pdfs::AdminUsageSnapshotReports::CountDataInjector do
#   let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }
#   let(:item) { { queryKey: some_query_key } }

#   describe '#run' do
#     context 'with valid query key' do
#       let(:some_query_key) { 'valid_key' } # Replace with a valid key from your COUNT_QUERY_MAPPING

#       before do
#         allow(Snapshots::COUNT_QUERY_MAPPING).to receive(:key?).with(some_query_key).and_return(true)
#         # Mock ResultsFetcher to return specific current and previous results
#       end

#       it 'returns item merged with count and change' do
#         injector = described_class.new(admin_report_filter_selection: admin_report_filter_selection, item: item)
#         result = injector.run
#         expect(result).to include(:count, :change)
#       end
#     end

#     context 'with invalid query key' do
#       let(:some_query_key) { 'invalid_key' }

#       it 'returns the original item' do
#         injector = described_class.new(admin_report_filter_selection: admin_report_filter_selection, item: item)
#         expect(injector.run).to eq(item)
#       end
#     end
#   end

#   describe 'private methods' do
#     # You can write tests for the private methods if necessary, though it's typically not recommended
#     # to directly test private methods. Instead, focus on testing public interfaces.
#   end
# end
