# frozen_string_literal: true

require 'rails_helper'

describe AdminDiagnosticReports::SendCsvEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:user_id) { create(:user).id }
    let(:timeframe) { { 'timeframe_start' => '2023-01-01', 'timeframe_end' => '2023-12-31' } }
    let(:school_ids) { [1, 2, 3] }
    let(:shared_filters) { {'grades' => [8,9,10]} }
    let(:overview_filters) { {'aggregation' => 'grade'} }
    let(:skills_filters) { {'aggregation' => 'teacher', 'diagnostic_id' => 1663} }
    let(:students_filters) { {'diagnostic_id' => 1663} }
    let(:default_params) { [user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters] }

    let(:mock_pre_assigned_payload) { {} }
    let(:mock_pre_completed_payload) { {} }
    let(:mock_post_assigned_payload) { {} }
    let(:mock_post_completed_payload) { {} }
    let(:mock_recommendations_payload) { {} }
    let(:mock_skill_payload) { {} }
    let(:mock_student_payload) { {} }
    let(:mock_student_recommendations_payload) { {} }
    let(:mock_csv) { "mock,csv,data" }
    let(:csv_tempfile) { Tempfile.new('mock.csv') }

    before do
      allow(AdminDiagnosticReports::PreDiagnosticAssignedViewQuery).to receive(:run).and_return(mock_pre_assigned_payload)
      allow(AdminDiagnosticReports::PreDiagnosticCompletedViewQuery).to receive(:run).and_return(mock_pre_completed_payload)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsQuery).to receive(:run).and_return(mock_recommendations_payload)
      allow(AdminDiagnosticReports::PostDiagnosticAssignedViewQuery).to receive(:run).and_return(mock_pre_assigned_payload)
      allow(AdminDiagnosticReports::PostDiagnosticCompletedViewQuery).to receive(:run).and_return(mock_pre_completed_payload)

      allow(AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery).to receive(:run).and_return(mock_skill_payload)

      allow(AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery).to receive(:run).and_return(mock_student_payload)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsByStudentQuery).to receive(:run).and_return(mock_student_recommendations_payload)

      allow(Adapters::Csv::AdminDiagnosticOverviewDataExport).to receive(:to_csv_string).and_return(mock_csv)
      allow(Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport).to receive(:to_csv_string).and_return(:to_csv_string)
      allow(Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport).to receive(:to_csv_string).and_return(:to_csv_string)

      allow(Tempfile).to receive(:new).and_return(csv_tempfile)
    end

    context 'upload succeeds' do
      let(:mock_uploader) { double(store!: [], url: 'a_url') }

      before do
        allow(AdminReportCsvUploader).to receive(:new).and_return(mock_uploader)
      end

      it { expect { subject.perform(*default_params) }.not_to raise_error }
    end

    context 'upload fails' do
      let(:mock_uploader) { double(store!: false) }

      before do
        allow(AdminReportCsvUploader).to receive(:new).and_return(mock_uploader)
      end

      it do
        expect { subject.perform(*default_params) }.to raise_error(described_class::CloudUploadError)
      end
    end
  end
end
