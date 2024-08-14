# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe SendSubscriptionCsvEmailWorker do
    subject { described_class.new }

    describe '#perform' do
      let(:user) { create(:user) }
      let(:email_subscription) { create(:email_subscription, user:, subscription_type: EmailSubscription::ADMIN_DIAGNOSTIC_REPORT) }
      let(:user_id) { user.id }
      let(:shared_filter_report_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SHARED }
      let(:overview_filter_report_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_OVERVIEW }
      let(:skills_filter_report_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL }
      let(:students_filter_report_name) { AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_STUDENT }
      let(:default_params) do
        [
          user_id,
          shared_filter_report_name,
          overview_filter_report_name,
          skills_filter_report_name,
          students_filter_report_name
        ]
      end
      let(:overview_payload) { { overview_arg: 'foo' } }
      let(:overview_report) { [{ row1: 'overview' }] }
      let(:overview_csv) { 'overview,csv,string' }
      let(:overview_url) { 'https://overview.example.com' }

      let(:skills_payload) { { skills_arg: 'foo' } }
      let(:skills_report) { [{ row1: 'skills' }] }
      let(:skills_csv) { 'skills,csv,string' }
      let(:skills_url) { 'https://skills.example.com' }

      let(:students_payload) { { students_arg: 'foo' } }
      let(:students_report) { [{ row1: 'students' }] }
      let(:students_csv) { 'students,csv,string' }
      let(:students_url) { 'https://students.example.com' }

      let(:mailer_double) { double(deliver_now!: nil) }

      # I don't know if this is the best way to handle this, but just confirm that the chain of services gets called as expected
      it do
        expect(AdminDiagnosticReports::ConstructOverviewQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, overview_filter_report_name).and_return(overview_payload)
        expect(AdminDiagnosticReports::AssembleOverviewReport).to receive(:run).with(overview_payload).and_return(overview_report)
        expect(AdminDiagnosticReports::OverviewCsvGenerator).to receive(:run).with(overview_report).and_return(overview_csv)
        expect(UploadToS3).to receive(:run).with(user, overview_csv, UploadToS3::CSV_FORMAT).and_return(overview_url)

        expect(AdminDiagnosticReports::ConstructSkillsQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, skills_filter_report_name).and_return(skills_payload)
        expect(AdminDiagnosticReports::AssembleSkillsReport).to receive(:run).with(skills_payload).and_return(skills_report)
        expect(AdminDiagnosticReports::SkillsCsvGenerator).to receive(:run).with(skills_report).and_return(skills_csv)
        expect(UploadToS3).to receive(:run).with(user, skills_csv, UploadToS3::CSV_FORMAT).and_return(skills_url)

        expect(AdminDiagnosticReports::ConstructStudentsQueryPayload).to receive(:run).with(user_id, shared_filter_report_name, students_filter_report_name).and_return(students_payload)
        expect(AdminDiagnosticReports::AssembleStudentsReport).to receive(:run).with(students_payload).and_return(students_report)
        expect(AdminDiagnosticReports::StudentsCsvGenerator).to receive(:run).with(students_report).and_return(students_csv)
        expect(UploadToS3).to receive(:run).with(user, students_csv, UploadToS3::CSV_FORMAT).and_return(students_url)

        expect(AdminDiagnosticReports::SubscriptionReportMailer).to receive(:csv_download_email).with(user_id, overview_url, skills_url, students_url, email_subscription.reload).and_return(mailer_double)
        expect(mailer_double).to receive(:deliver_now!)

        subject.perform(*default_params)
      end
    end
  end
end
