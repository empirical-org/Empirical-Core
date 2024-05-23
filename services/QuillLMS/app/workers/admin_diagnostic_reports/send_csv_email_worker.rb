# frozen_string_literal: true

module AdminDiagnosticReports
  class SendCsvEmailWorker
    include Sidekiq::Worker

    class CloudUploadError < StandardError; end

    TEMPFILE_NAME = 'temp.csv'

    def perform(user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters)
      @user = User.find(user_id)
      @payload = generate_query_payload(timeframe, school_ids, shared_filters, aggregation, diagnostic_id)
      @overview_filters = overview_filters
      @skills_filters = skills_filters
      @students_filters = students_filters

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
      diagnostic_ids = (base_data.map{|row| row[:diagnostic_id]} + supplemental_data.map{|row| row[:diagnostic_id]}).uniq

      unique_base_keys = base_data.first.keys - supplemental_data.first.keys
      unique_supplemental_keys = supplemental_data.first.keys - base_data.first.keys

      base_data_fallback = unique_base_keys.to_h{|key| [key, nil]}
      supplemental_data_fallback = unique_supplemental_keys.to_h{|key| [key, nil]}

      merged_data = diagnostic_ids.map do |diagnostic_id|
        left_data = base_data.find{|row| row[:diagnostic_id] == diagnostic_id} || base_data_fallback
        right_data = supplemental_data.find{|row| row[:diagnostic_id] == diagnostic_id} || supplemental_data_fallback

        aggregate_rows = merge_aggregate_rows(left_data.delete(:aggregate_rows), right_data.delete(:aggregate_rows))

        left_data.merge(right_data).merge({aggregate_rows:})
      end
    end

    private def merge_aggregate_rows(base_data, supplemental_data)
      all_aggregate_ids = ((base_data&.map{|row| row[:aggregate_id]} || []) + (supplemental_data&.map{|row| row[:aggregate_id]} || [])).uniq

      unique_base_keys = (base_data&.first&.keys || []) - (supplemental_data&.first&.keys || [])
      unique_supplemental_keys = (supplemental_data&.first&.keys || []) - (base_data&.first&.keys || [])

      base_data_fallback = unique_base_keys.to_h{|key| [key, nil]}
      supplemental_data_fallback = unique_supplemental_keys.to_h{|key| [key, nil]}

      all_aggregate_ids.map do |aggregate_id|
        left_data = base_data&.find{|row| row[:aggregate_id] == aggregate_id} || base_data_fallback
        right_data = supplemental_data&.find{|row| row[:aggregate_id] == aggregate_id} || supplemental_data_fallback

        left_data.merge(right_data)
      end
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
