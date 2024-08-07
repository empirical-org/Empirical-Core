# frozen_string_literal: true

module AdminDiagnosticReports
  class SendCsvEmailWorker
    include Sidekiq::Worker

    attr_reader :user, :shared_filter_report_name, :overview_filter_report_name, :skills_filter_report_name, :students_filter_report_name

    TEMPFILE_NAME = 'temp.csv'

    def perform(user_id, shared_filter_report_name, overview_filter_report_name, skills_filter_report_name, students_filter_report_name)
      @user = User.find(user_id)
      @shared_filter_report_name = shared_filter_report_name
      @overview_filter_report_name = overview_filter_report_name
      @skills_filter_report_name = skills_filter_report_name
      @students_filter_report_name = students_filter_report_name

      mailer.csv_download_email(*email_payload).deliver_now!
    end

    private def mailer = ReportMailer

    private def email_payload
      @email_payload ||= [
        user.id,
        generate_overview_link(user.id, shared_filter_report_name, overview_filter_report_name),
        generate_skills_link(user.id, shared_filter_report_name, skills_filter_report_name),
        generate_students_link(user.id, shared_filter_report_name, students_filter_report_name)
      ]
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
      puts "    ====    ====    ====    ====    ===="
      puts students_payload
      students_report = AssembleStudentsReport.run(students_payload)
      puts students_report.length
      students_csv = StudentsCsvGenerator.run(students_report)
      puts students_csv.length
      puts "    ====    ====    ====    ====    ===="
      UploadToS3.run(user, students_csv, UploadToS3::CSV_FORMAT)
    end
  end
end
