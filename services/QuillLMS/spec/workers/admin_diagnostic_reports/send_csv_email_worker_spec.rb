# frozen_string_literal: true

require 'rails_helper'

describe AdminDiagnosticReports::SendCsvEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:user) { create(:user) }
    let(:user_id) { user.id }
    let(:shared_filter_report_name) { AdminDiagnosticReportsController::BASE_REPORT_FILTER_NAME }
    let(:overview_filter_report_name) { AdminDiagnosticReportsController::OVERVIEW_REPORT_FILTER_NAME }
    let(:skills_filter_report_name) { AdminDiagnosticReportsController::SKILL_REPORT_FILTER_NAME }
    let(:students_filter_report_name) { AdminDiagnosticReportsController::STUDENT_REPORT_FILTER_NAME }
    let(:default_params) do
      [
        user_id,
        shared_filter_report_name,
        overview_filter_report_name,
        skills_filter_report_name,
        students_filter_report_name
      ]
    end
    let(:overview_payload) { {overview_arg: 'foo'} }
    let(:overview_report) { [{row1: 'overview'}] }
    let(:overview_csv) { 'overview,csv,string' }
    let(:overview_url) { 'https://overview.example.com' }

    let(:skills_payload) { {skills_arg: 'foo'} }
    let(:skills_report) { [{row1: 'skills'}] }
    let(:skills_csv) { 'skills,csv,string' }
    let(:skills_url) { 'https://skills.example.com' }

    let(:students_payload) { {students_arg: 'foo'} }
    let(:students_report) { [{row1: 'students'}] }
    let(:students_csv) { 'students,csv,string' }
    let(:students_url) { 'https://students.example.com' }

    let(:mailer_double) { double(deliver_now!: nil) }

    # I don't know if this is the best way to handle this, but just confirm that the chain of services gets called as expected
    it do
      expect(AdminDiagnosticReports::ConstructOverviewQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, overview_filter_report_name).and_return(overview_payload)
      expect(AdminDiagnosticReports::AssembleOverviewReport).to receive(:run).with(overview_payload).and_return(overview_report)
      expect(Adapters::Csv::AdminDiagnosticOverviewDataExport).to receive(:to_csv_string).with(overview_report).and_return(overview_csv)
      expect(UploadToS3).to receive(:run).with(user, overview_csv).and_return(overview_url)

      expect(AdminDiagnosticReports::ConstructSkillsQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, skills_filter_report_name).and_return(skills_payload)
      expect(AdminDiagnosticReports::AssembleSkillsReport).to receive(:run).with(skills_payload).and_return(skills_report)
      expect(Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport).to receive(:to_csv_string).with(skills_report).and_return(skills_csv)
      expect(UploadToS3).to receive(:run).with(user, skills_csv).and_return(skills_url)

      expect(AdminDiagnosticReports::ConstructStudentsQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, students_filter_report_name).and_return(students_payload)
      expect(AdminDiagnosticReports::AssembleStudentsReport).to receive(:run).with(students_payload).and_return(students_report)
      expect(Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport).to receive(:to_csv_string).with(students_report).and_return(students_csv)
      expect(UploadToS3).to receive(:run).with(user, students_csv).and_return(students_url)

      expect(AdminDiagnosticReports::ReportMailer).to receive(:csv_download_email).with(user_id, overview_url, skills_url, students_url).and_return(mailer_double)
      expect(mailer_double).to receive(:deliver_now!)

      subject.perform(*default_params)
    end
  end
end
