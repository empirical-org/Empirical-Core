# frozen_string_literal: true

module AdminDiagnosticReports
  class SendCsvEmailWorker
    include Sidekiq::Worker

    attr_reader :user

    TEMPFILE_NAME = 'temp.csv'

    def perform(user_id, shared_filter_report_name, overview_filter_report_name, skills_filter_report_name, students_filter_report_name)
      @user = User.find(user_id)

      overview_link = generate_overview_link(user_id, shared_filter_report_name, overview_filter_report_name)
      skills_link = generate_skills_link(user_id, shared_filter_report_name, skills_filter_report_name)
      students_link = generate_students_link(user_id, shared_filter_report_name, students_filter_report_name)

      ReportMailer.csv_download_email(user_id, overview_link, skills_link, students_link).deliver_now!
    end

    private def generate_overview_link(user_id, shared_filter_report_name, overview_filter_report_name)
      overview_payload = ConstructOverviewQueryPayload.run(user_id, shared_filter_report_name, overview_filter_report_name)
      overview_report = AssembleOverviewReport.run(overview_payload)
      overview_csv = OverviewCsvGenerator.run(overview_report)
      UploadToS3.run(user, overview_csv, UploadToS3::CSV_FORMAT)
    end

    private def generate_skills_link(user_id, shared_filter_report_name, skills_filter_report_name)
      skills_payload = ConstructSkillsQueryPayload.run(user_id, shared_filter_report_name, skills_filter_report_name)
      skills_report = AssembleSkillsReport.run(skills_payload)
      skills_csv = SkillsCsvGenerator.run(skills_report)
      UploadToS3.run(user, skills_csv, UploadToS3::CSV_FORMAT)
    end

    private def generate_students_link(user_id, shared_filter_report_name, students_filter_report_name)
      students_payload = ConstructStudentsQueryPayload.run(user_id, shared_filter_report_name, students_filter_report_name)
      students_report = AssembleStudentsReport.run(students_payload)
      students_csv = StudentsCsvGenerator.run(students_report)
      UploadToS3.run(user, students_csv, UploadToS3::CSV_FORMAT)
    end
  end
end
