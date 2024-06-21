# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe ConstructStudentsQueryPayload do
    subject { described_class.run(*payload) }

    let(:payload) { [user.id, shared_filter_name, specific_filter_name] }

    let(:user) { create(:user) }
    let(:shared_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT }
    let(:specific_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_STUDENT }
    let(:specific_filters) { create(:diagnostic_report_student_selection, user:, report: specific_filter_name) }

    it { expect(specific_filters.diagnostic_id).to eq(subject[:diagnostic_id]) }
    it { expect(subject.keys).not_to include(:aggregation) }

    context 'no saved specific filters' do
      let(:specific_cilters) { nil }

      it { expect(described_class::DEFAULT_DIAGNOSTIC_ID).to eq(subject[:diagnostic_id]) }
    end
  end
end
