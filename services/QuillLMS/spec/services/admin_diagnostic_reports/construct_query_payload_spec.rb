# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe ConstructQueryPayload do
    subject { test_payload_constructor.run(*payload) }

    let(:test_payload_constructor) do
      Class.new(described_class) do
        private def report_specific_filters
          {
            aggregation: specific_filters&.aggregation || default_aggregation,
            diagnostic_id: specific_filters&.diagnostic_id || default_diagnostic_id
          }
        end
      end
    end

    let(:payload) { [user.id, shared_filter_name, specific_filter_name] }

    let(:user) { create(:user) }
    let(:premium_schools) { create_list(:school, 3) }
    let(:shared_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT }
    let(:shared_filters) { create(:admin_report_filter_selection, user:, report: shared_filter_name, filter_selections: shared_filter_selections) }
    let(:shared_filter_selections) do
      {
        grades: [
          { name: '1st', label: '1st', value: '1' },
          { name: '2nd', label: '2nd', value: '2' }
        ],
        schools: [
          { "id": premium_schools.first.id, "name": premium_schools.first.name, "label": premium_schools.first.name, "value": premium_schools.first.id }
        ],
        timeframe: {
          name: 'This school year',
          label: 'This school year',
          value: 'this-school-year',
          default: true
        }
      }
    end
    let(:specific_filter_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_SKILL }
    let(:specific_filters) { create(:diagnostic_report_skill_selection, user:, report: specific_filter_name) }

    let(:timeframe) { Snapshots::Timeframes.calculate_timeframes(shared_filters.timeframe_value) }
    let(:expected_result) do
      {
        user:,
        timeframe_start: timeframe[0],
        timeframe_end: timeframe[1],
        school_ids: shared_filters.school_ids,
        grades: shared_filters.grade_values,
        teacher_ids: shared_filters.teacher_ids,
        classroom_ids: shared_filters.teacher_ids,
        aggregation: specific_filters.aggregation,
        diagnostic_id: specific_filters.diagnostic_id
      }
    end

    before do
      allow(User).to receive(:find).with(user.id).and_return(user)
      allow(user).to receive(:administered_premium_schools).and_return(premium_schools)
    end

    it { expect(expected_result).to eq(subject) }

    context 'no saved shared filters' do
      let(:shared_filters) { nil }
      let(:default_timeframe) { Snapshots::Timeframes.calculate_timeframes(described_class::DEFAULT_TIMEFRAME) }
      let(:default_school_ids) { premium_schools.pluck(:id) }
      let(:default_grades) { nil }
      let(:default_teacher_ids) { nil }
      let(:default_classroom_ids) { nil }

      it { expect(subject[:timeframe_start]).to eq(default_timeframe[0]) }
      it { expect(subject[:timeframe_end]).to eq(default_timeframe[1]) }
    end

    context 'no saved specific filters' do
      let(:specific_filters) { nil }

      it { expect(subject[:aggregation]).to eq(described_class::DEFAULT_AGGREGATION) }
      it { expect(subject[:diagnostic_id]).to eq(described_class::DEFAULT_DIAGNOSTIC_ID) }
    end
  end
end
