# frozen_string_literal: true

require 'rails_helper'

describe AdminDiagnosticReports::EnqueueCsvEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:user) { create(:user) }
    let(:user_id) { user.id }
    let(:stub_timeframe) { Snapshots::Timeframes.calculate_timeframes('this-school-year') }
    let(:processed_timeframe) { {'timeframe_start' => stub_timeframe[0].to_s, 'timeframe_end' => stub_timeframe[1].to_s} }
    let(:schools) { create_list(:school, 3) }
    let!(:school_admins) { schools.map { |school| create(:schools_admins, user: user, school: school) } }
    let(:school_ids) { schools.pluck(:id) }
    let(:shared_filters) { {} }
    let(:overview_filters) { {aggregation: described_class::DEFAULT_AGGREGATION} }
    let(:skills_filters) { {aggregation: described_class::DEFAULT_AGGREGATION, diagnostic_id: described_class::DEFAULT_DIAGNOSTIC_ID} }
    let(:students_filters) { {diagnostic_id: described_class::DEFAULT_DIAGNOSTIC_ID} }
    let(:expected_params) do
      [
        user_id,
        processed_timeframe,
        school_ids,
        shared_filters,
        overview_filters,
        skills_filters,
        students_filters
      ]
    end

    before do
      allow(subject).to receive(:school_ids).and_return(school_ids)
      allow(Snapshots::Timeframes).to receive(:calculate_timeframes).with(described_class::DEFAULT_TIMEFRAME).and_return(stub_timeframe)
    end

    context 'no saved filters' do
      it do
        expect(AdminDiagnosticReports::SendCsvEmailWorker).to receive(:perform_async).with(*expected_params)

        subject.perform(user_id)
      end
    end

    context 'saved shared filters' do
      let(:shared_filter_selections) { {'grades' => [{'value' => 1}]} }
      let(:shared_filters) { {'grades' => [1]} }

      before do
        create(:admin_report_filter_selection, user: user, report: described_class::BASE_REPORT_NAME, filter_selections: shared_filter_selections)
      end

      it do
        expect(AdminDiagnosticReports::SendCsvEmailWorker).to receive(:perform_async).with(*expected_params)

        subject.perform(user_id)
      end
    end

    context 'saved overview aggregation' do
      let(:overview_filter_selections) { {'group_by_value' => {'value' => 'teacher'}} }
      let(:overview_filters) { {aggregation: 'teacher'} }

      before do
        create(:admin_report_filter_selection, user: user, report: described_class::OVERVIEW_REPORT_NAME, filter_selections: overview_filter_selections)
      end

      it do 
        expect(AdminDiagnosticReports::SendCsvEmailWorker).to receive(:perform_async).with(*expected_params)

        subject.perform(user_id)
      end
    end

    context 'saved skills aggregation and diagnostic_id' do
      let(:skills_filter_selections) { {'group_by_value' => {'value' => 'teacher'}, 'diagnostic_type_value' => {'value' => 1000}} }
      let(:skills_filters) { {aggregation: 'teacher', diagnostic_id: 1000} }

      before do
        create(:admin_report_filter_selection, user: user, report: described_class::SKILL_REPORT_NAME, filter_selections: skills_filter_selections)
      end

      it do 
        expect(AdminDiagnosticReports::SendCsvEmailWorker).to receive(:perform_async).with(*expected_params)

        subject.perform(user_id)
      end
    end

    context 'saved students diagnostic_id' do
      let(:students_filter_selections) { {'diagnostic_type_value' => {'value' => 1000}} }
      let(:students_filters) { {diagnostic_id: 1000} }

      before do
        create(:admin_report_filter_selection, user: user, report: described_class::STUDENT_REPORT_NAME, filter_selections: students_filter_selections)
      end

      it do 
        expect(AdminDiagnosticReports::SendCsvEmailWorker).to receive(:perform_async).with(*expected_params)

        subject.perform(user_id)
      end
    end
  end
end
