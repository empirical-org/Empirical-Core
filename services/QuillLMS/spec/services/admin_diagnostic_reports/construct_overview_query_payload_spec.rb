# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe ConstructOverviewQueryPayload do
    subject { described_class.run(*payload) }

    let(:payload) { [user.id, shared_filter_name, specific_filter_name] }

    let(:user) { create(:user) }
    let(:shared_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT }
    let(:specific_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_OVERVIEW }
    let(:specific_filters) { create(:diagnostic_report_overview_selection, user:, report: specific_filter_name) }

    it { expect(specific_filters.aggregation).to eq(subject[:aggregation]) }
    it { expect(subject.keys).not_to include(:diagnostic_id) }

    context 'no saved specific filters' do
      let(:specific_cilters) { nil }

      it { expect(subject[:aggregation]).to eq(described_class::DEFAULT_AGGREGATION) }
    end
  end
end
