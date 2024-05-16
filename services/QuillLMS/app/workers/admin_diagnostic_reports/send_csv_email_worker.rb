# frozen_string_literal: true

module AdminDiagnosticReports
  class SendCsvEmailWorker
    include Sidekiq::Worker

    class CloudUploadError < StandardError; end

    TEMPFILE_NAME = 'temp.csv'

    def perform(user_id, timeframe, school_ids, filters, aggregation, diagnostic_id)
      @user = User.find(user_id)
      @payload = generate_query_payload(timeframe, school_ids, filters, aggregation, diagnostic_id)

      ReportMailer.csv_download_email(user_id, overview_link, skills_link, students_link).deliver_now!
    end

    private def generate_query_payload(timeframe, school_ids, filters, aggregation, diagnostic_id)
      {
        timeframe_start: parse_datetime_string(timeframe['timeframe_start']),
        timeframe_end: parse_datetime_string(timeframe['timeframe_end']),
        school_ids:, 
        grades: filters.fetch('grades', nil),
        teacher_ids: filters.fetch('teacher_ids', nil),
        classroom_ids: filters.fetch('classroom_ids', nil),
        aggregation:,
        diagnostic_id:,
        user: @user
      }
    end

    private def overview_link
      @payload.except(:diagnostic_id)

      "OVERVIEW TEST" # TODO: return an actual file link
    end

    private def skills_link
      query_results = DiagnosticPerformanceBySkillViewQuery.run(**@payload)
      data = Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport.to_csv_string(query_results)
      upload_csv(data)
    end

    private def students_link
      student_payload = @payload.except(:aggregation)

      query_results = DiagnosticPerformanceByStudentViewQuery.run(**student_payload)
      recommendation_results = DiagnosticRecommendationsByStudentQuery.run(**student_payload)

      merged_results = query_results.map { |query_result| query_result.merge(recommendation_results.fetch(query_result[:student_id], {completed_activities: nil, time_spent_seconds: nil})) }

      data = Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport.to_csv_string(merged_results)
      upload_csv(data)
    end

    private def upload_csv(data)
      csv_tempfile = Tempfile.new(TEMPFILE_NAME)
      csv_tempfile << data

      # store! returns nil on failure, rather than raising an exception.
      # We address this gotcha by manually raising an exception.
      upload_status = uploader.store!(csv_tempfile)
      puts uploader
      raise CloudUploadError, "Unable to upload CSV for user #{user_id}" unless upload_status

      # The response-content-disposition param triggers browser file download instead of screen rendering
      uploader.url(query: {"response-content-disposition" => "attachment;"})
    end

    private def uploader
      @uploader ||= AdminReportCsvUploader.new(admin_id: @user.id)
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end

  end
end
