# frozen_string_literal: true

module AdminDiagnosticReports
  class SendCsvEmailWorker
    include Sidekiq::Worker

    class CloudUploadError < StandardError; end

    TEMPFILE_NAME = 'temp.csv'

    def perform(user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters)
      @user = User.find(user_id)
      @payload = generate_query_payload(timeframe, school_ids, shared_filters)
      @overview_filters = overview_filters.symbolize_keys
      @skills_filters = skills_filters.symbolize_keys
      @students_filters = students_filters.symbolize_keys

      ReportMailer.csv_download_email(user_id, overview_link, skills_link, students_link).deliver_now!
    end

    private def generate_query_payload(timeframe, school_ids, filters)
      {
        timeframe_start: parse_datetime_string(timeframe['timeframe_start']),
        timeframe_end: parse_datetime_string(timeframe['timeframe_end']),
        school_ids:,
        grades: filters.fetch('grades', nil),
        teacher_ids: filters.fetch('teacher_ids', nil),
        classroom_ids: filters.fetch('classroom_ids', nil),
        user: @user
      }
    end

    private def overview_link
      overview_payload = @payload.merge(@overview_filters)

      pre_assigned = PreDiagnosticAssignedViewQuery.run(**overview_payload)
      pre_completed = PreDiagnosticCompletedViewQuery.run(**overview_payload)
      recommendations = DiagnosticRecommendationsQuery.run(**overview_payload)
      post_assigned = PostDiagnosticAssignedViewQuery.run(**overview_payload)
      post_completed = PostDiagnosticCompletedViewQuery.run(**overview_payload)

      combined_pre = merge_results(pre_assigned, pre_completed)
      combined_recommendations = merge_results(combined_pre, recommendations)
      combined_post = merge_results(post_assigned, post_completed)

      query_results = merge_results(combined_recommendations, combined_post)

      data = Adapters::Csv::AdminDiagnosticOverviewDataExport.to_csv_string(query_results)
      upload_csv(data)
    end

    private def merge_results(base_data, supplemental_data)
      diagnostic_ids = extract_unique_ids(base_data, supplemental_data, :diagnostic_id)

      base_keys = base_data.first&.keys || []
      supplemental_keys = supplemental_data.first&.keys || []

      base_data_fallback, supplemental_data_fallback = generate_fallback_hashes(base_data, supplemental_data)

      merged_data = diagnostic_ids.map do |diagnostic_id|
        left_data = find_row_or_fallback(base_data, :diagnostic_id, diagnostic_id, base_data_fallback)
        right_data = find_row_or_fallback(supplemental_data, :diagnostic_id, diagnostic_id, supplemental_data_fallback)

        aggregate_rows = merge_aggregate_rows(left_data.delete(:aggregate_rows), right_data.delete(:aggregate_rows))

        left_data.merge(right_data).merge({aggregate_rows:})
      end
    end

    private def merge_aggregate_rows(base_data, supplemental_data)
      all_aggregate_ids = extract_unique_ids(base_data, supplemental_data, :aggregate_id)

      base_data_fallback, supplemental_data_fallback = generate_fallback_hashes(base_data, supplemental_data)

      all_aggregate_ids.map do |aggregate_id|
        left_data = find_row_or_fallback(base_data, :aggregate_id, aggregate_id, base_data_fallback)
        right_data = find_row_or_fallback(supplemental_data, :aggregate_id, aggregate_id, supplemental_data_fallback)

        left_data.merge(right_data)
      end
    end

    private def find_row_or_fallback(data, key, value, fallback)
      data&.find{|row| row[key] == value} || fallback
    end

    private def extract_unique_ids(base_data, supplemental_data, key)
      ((base_data&.map{|row| row[key]} || []) + (supplemental_data&.map{|row| row[key]} || [])).uniq
    end

    private def generate_fallback_hashes(base_data, supplemental_data)
      unique_base_keys = calculate_unique_keys(base_data, supplemental_data)
      unique_supplemental_keys = calculate_unique_keys(supplemental_data, base_data)

      base_data_fallback = unique_base_keys.index_with{nil}
      supplemental_data_fallback = unique_supplemental_keys.index_with{nil}

      [base_data_fallback, supplemental_data_fallback]
    end

    private def calculate_unique_keys(unique_from, compare_to)
      (unique_from&.first&.keys || []) - (compare_to&.first&.keys || [])
    end

    private def skills_link
      skills_payload = @payload.merge(@skills_filters)

      query_results = DiagnosticPerformanceBySkillViewQuery.run(**skills_payload)
      data = Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport.to_csv_string(query_results)
      upload_csv(data)
    end

    private def students_link
      student_payload = @payload.merge(@students_filters)

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
      raise CloudUploadError, "Unable to upload CSV for user #{@user.id}" unless upload_status

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
