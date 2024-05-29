# frozen_string_literal: true

require 'rails_helper'

describe AdminDiagnosticReports::SendCsvEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:user) { create(:user) }
    let(:user_id) { user.id }
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

    let(:uploader_url) { 'a_url' }
    let(:mock_uploader) { double(store!: [], url: uploader_url) }

    let(:mailer_double) { double(deliver_now!: nil) }

    before do
      allow(AdminDiagnosticReports::PreDiagnosticAssignedViewQuery).to receive(:run).and_return(mock_pre_assigned_payload)
      allow(AdminDiagnosticReports::PreDiagnosticCompletedViewQuery).to receive(:run).and_return(mock_pre_completed_payload)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsQuery).to receive(:run).and_return(mock_recommendations_payload)
      allow(AdminDiagnosticReports::PostDiagnosticAssignedViewQuery).to receive(:run).and_return(mock_post_assigned_payload)
      allow(AdminDiagnosticReports::PostDiagnosticCompletedViewQuery).to receive(:run).and_return(mock_post_completed_payload)

      allow(AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery).to receive(:run).and_return(mock_skill_payload)

      allow(AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery).to receive(:run).and_return(mock_student_payload)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsByStudentQuery).to receive(:run).and_return(mock_student_recommendations_payload)

      allow(Adapters::Csv::AdminDiagnosticOverviewDataExport).to receive(:to_csv_string).and_return(mock_csv)
      allow(Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport).to receive(:to_csv_string).and_return(:to_csv_string)
      allow(Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport).to receive(:to_csv_string).and_return(:to_csv_string)

      allow(Tempfile).to receive(:new).and_return(csv_tempfile)

      allow(AdminReportCsvUploader).to receive(:new).and_return(mock_uploader)

      allow(AdminDiagnosticReports::ReportMailer).to receive(:csv_download_email).and_return(mailer_double)
    end

    context 'mailer sent' do
      it do
        expect(AdminDiagnosticReports::ReportMailer).to receive(:csv_download_email).with(user_id, uploader_url, uploader_url, uploader_url).and_return(mailer_double)
        expect(mailer_double).to receive(:deliver_now!)

        subject.perform(*default_params)
      end
    end

    context 'payload assembly' do
      let(:shared_payload) do
        {
          timeframe_start: subject.send(:parse_datetime_string, timeframe['timeframe_start']),
          timeframe_end: subject.send(:parse_datetime_string, timeframe['timeframe_end']),
          school_ids:, 
          grades: shared_filters['grades'],
          teacher_ids: nil,
          classroom_ids: nil,
          user:
        }
      end

      context 'overview payload' do
        let(:expected_payload) { shared_payload.merge(overview_filters) }

        it do
          expect(AdminDiagnosticReports::PreDiagnosticAssignedViewQuery)
            .to receive(:run)
            .with(**expected_payload)
            .and_return(mock_pre_assigned_payload)

          subject.perform(*default_params)
        end
      end

      context 'skills payload' do
        let(:expected_payload) { shared_payload.merge(skills_filters) }

        it do
          expect(AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery)
            .to receive(:run)
            .with(**expected_payload)
            .and_return(mock_skill_payload)

          subject.perform(*default_params)
        end
      end

      context 'students payload' do
        let(:expected_payload) { shared_payload.merge(students_filters) }

        it do
          expect(AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery)
            .to receive(:run)
            .with(**expected_payload)
            .and_return(mock_skill_payload)

          subject.perform(*default_params)
        end
      end
    end

    context 'data preparation for CSV generation' do
      context 'overview' do
        let(:mock_pre_assigned_payload) do
          [
            {
              diagnostic_id: 1663,
              pre_students_assigned: 4104,
              aggregate_rows: [
                {aggregate_id: "9", pre_students_assigned: 2994},
                {aggregate_id: "10", pre_students_assigned: 417}
              ]
            },
            {
              diagnostic_id: 1668,
              pre_students_assigned: 1869,
              aggregate_rows: [
                {aggregate_id: "9", pre_students_assigned: 1385},
                {aggregate_id: "10", pre_students_assigned: 108}
              ]
            }
          ]
        end
        let(:mock_pre_completed_payload) do
          [
            {
              diagnostic_id: 1663,
              pre_average_score: 0.5708,
              pre_students_completed: 3012,
              aggregate_rows: [
                {aggregate_id: "9", pre_average_score: 0.5557, pre_students_completed: 2284},
                {aggregate_id: "10", pre_average_score: 0.6497, pre_students_completed: 329}
              ]
            },
            {
              diagnostic_id: 1668,
              pre_average_score: 0.4544,
              pre_students_completed: 1340,
              aggregate_rows: [
                {aggregate_id: "9", pre_average_score: 0.4534, pre_students_completed: 1036},
                {aggregate_id: "10", pre_average_score: 0.4309, pre_students_completed: 81}
              ]
            }
          ]
        end
        let(:mock_post_assigned_payload) do
          [
            {
              diagnostic_id: 1663,
              post_students_assigned: 2057,
              aggregate_rows: [
                {aggregate_id: "9", post_students_assigned: 1797},
                {aggregate_id: "10", post_students_assigned: 96}
              ]
            },
            {
              diagnostic_id: 1668,
              post_students_assigned: 745,
              aggregate_rows: [
                {aggregate_id: "9", post_students_assigned: 682}
                # Aggregate row 10 is intentionally missing based on real-world sample data and to ensure that code passes when this real-world state is run through this worker
              ]
            }
          ]
        end
        let(:mock_post_completed_payload) do
          [
            {
              diagnostic_id: 1663,
              overall_skill_growth: 0.1442,
              post_students_completed: 1158,
              aggregate_rows: [
                {aggregate_id: "9", overall_skill_growth: 0.1463, post_students_completed: 1056},
                {aggregate_id: "10", overall_skill_growth: 0.0754, post_students_completed: 37}
              ]
            },
            {
              diagnostic_id: 1668,
              overall_skill_growth: 0.1014,
              post_students_completed: 473,
              aggregate_rows: [
                {aggregate_id: "9", overall_skill_growth: 0.1037, post_students_completed: 437},
                {aggregate_id: "10", overall_skill_growth: nil, post_students_completed: 0}
              ]
            }
          ]
        end
        let(:mock_recommendations_payload) do
          [
            {
              diagnostic_id: 1663,
              average_practice_activities_count: 19.4781,
              average_time_spent_seconds: 5954.5283,
              students_completed_practice: 1215,
              aggregate_rows: [
                {aggregate_id: "9", average_practice_activities_count: 19.5791, average_time_spent_seconds: 6041.9606, students_completed_practice: 1093},
                {aggregate_id: "10", average_practice_activities_count: 14.6666, average_time_spent_seconds: 4466, students_completed_practice: 3}
              ]
            },
            {
              diagnostic_id: 1668,
              average_practice_activities_count: 26.5725,
              average_time_spent_seconds: 7010.8548,
              students_completed_practice: 627,
              aggregate_rows: [
                {aggregate_id: "9", average_practice_activities_count: 26.4242, average_time_spent_seconds: 6989.6919, students_completed_practice: 568},
                {aggregate_id: "10", average_practice_activities_count: 13.7857, average_time_spent_seconds: 4167.5714, students_completed_practice: 14}
              ]
            }
          ]
        end
        let(:combined_payload) do
          [
            {
              diagnostic_id: 1663,
              pre_students_assigned: 4104,
              pre_average_score: 0.5708,
              pre_students_completed: 3012,
              post_students_assigned: 2057,
              overall_skill_growth: 0.1442,
              post_students_completed: 1158,
              average_practice_activities_count: 19.4781,
              average_time_spent_seconds: 5954.5283,
              students_completed_practice: 1215,
              aggregate_rows: [
                {aggregate_id: "9", pre_students_assigned: 2994, pre_average_score: 0.5557, pre_students_completed: 2284, post_students_assigned: 1797, overall_skill_growth: 0.1463, post_students_completed: 1056, average_practice_activities_count: 19.5791, average_time_spent_seconds: 6041.9606, students_completed_practice: 1093},
                {aggregate_id: "10", pre_students_assigned: 417, pre_average_score: 0.6497, pre_students_completed: 329, post_students_assigned: 96, overall_skill_growth: 0.0754, post_students_completed: 37, average_practice_activities_count: 14.6666, average_time_spent_seconds: 4466, students_completed_practice: 3}
              ]
            },
            {
              diagnostic_id: 1668,
              pre_students_assigned: 1869,
              pre_average_score: 0.4544,
              pre_students_completed: 1340,
              post_students_assigned: 745,
              overall_skill_growth: 0.1014,
              post_students_completed: 473,
              average_practice_activities_count: 26.5725,
              average_time_spent_seconds: 7010.8548,
              students_completed_practice: 627,
              aggregate_rows: [
                {aggregate_id: "9", pre_students_assigned: 1385, pre_average_score: 0.4534, pre_students_completed: 1036, post_students_assigned: 682, overall_skill_growth: 0.1037, post_students_completed: 437, average_practice_activities_count: 26.4242, average_time_spent_seconds: 6989.6919, students_completed_practice: 568},
                {aggregate_id: "10", pre_students_assigned: 108, pre_average_score: 0.4309, pre_students_completed: 81, post_students_assigned: nil, overall_skill_growth: nil, post_students_completed: 0, average_practice_activities_count: 13.7857, average_time_spent_seconds: 4167.5714, students_completed_practice: 14}
              ]
            }
          ]
        end

        it do
          expect(Adapters::Csv::AdminDiagnosticOverviewDataExport).to receive(:to_csv_string).with(combined_payload)

          subject.perform(*default_params)
        end
      end

      context 'skills' do
        it do
          expect(Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport).to receive(:to_csv_string).with(mock_skill_payload)

          subject.perform(*default_params)
        end
      end

      context 'students' do
        let(:mock_student_payload) do
          [
            {student_id: 1, test_data: 'has recommendations'},
            {student_id: 2, test_data: 'has no recommendations'}
          ]
        end
        let(:mock_student_recommendations_payload) { {1 => {time_spent_seconds: 50, completed_activities: 1 }} }
        let(:combined_payload) do
          [
            {student_id: 1, test_data: 'has recommendations', time_spent_seconds: 50, completed_activities: 1},
            {student_id: 2, test_data: 'has no recommendations', time_spent_seconds: nil, completed_activities: nil}
          ]
        end

        it do
          expect(Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport).to receive(:to_csv_string).with(combined_payload)

          subject.perform(*default_params)
        end
      end
    end

    context 'upload succeeds' do
      it { expect { subject.perform(*default_params) }.not_to raise_error }
    end

    context 'upload fails' do
      let(:mock_uploader) { double(store!: false) }

      it do
        expect { subject.perform(*default_params) }.to raise_error(described_class::CloudUploadError)
      end
    end
  end
end
