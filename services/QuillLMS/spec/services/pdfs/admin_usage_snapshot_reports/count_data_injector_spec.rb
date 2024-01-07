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
