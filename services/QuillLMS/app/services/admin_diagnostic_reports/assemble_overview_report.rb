# frozen_string_literal: true

module AdminDiagnosticReports
  class AssembleOverviewReport < ApplicationService
    attr_reader :payload

    def initialize(payload)
      @payload = payload
    end

    def run
      combine_query_parts
    end

    private def pre_assigned = @pre_assigned ||= PreDiagnosticAssignedViewQuery.run(**payload)
    private def pre_completed = @pre_completed ||= PreDiagnosticCompletedViewQuery.run(**payload)
    private def recommendations = @recommendations ||= DiagnosticRecommendationsQuery.run(**payload)
    private def post_assigned = @post_assigned ||= PostDiagnosticAssignedViewQuery.run(**payload)
    private def post_completed = @post_completed ||= PostDiagnosticCompletedViewQuery.run(**payload)

    private def combine_query_parts
      combined_pre = merge_results(pre_assigned, pre_completed, [], [:pre_students_completed])
      combined_recommendations = merge_results(combined_pre, recommendations, [], [:students_completed_practice, :average_practice_activities_count, :average_time_spent_seconds])
      combined_post = merge_results(post_assigned, post_completed, [:post_students_assigned], [:post_students_completed, :overall_skill_growth])

      merge_results(combined_recommendations, combined_post)
    end

    private def merge_results(base_data, supplemental_data, ensure_base_keys = [], ensure_supplemental_keys = [])
      diagnostic_ids = extract_unique_ids(base_data, supplemental_data, :diagnostic_id)

      base_data_fallback, supplemental_data_fallback = generate_fallback_hashes(base_data, supplemental_data, ensure_base_keys, ensure_supplemental_keys)

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
      ((base_data&.map{|row| row[key]} || []) + (supplemental_data&.map{|row| row[key]} || [])).compact.uniq
    end

    private def generate_fallback_hashes(base_data, supplemental_data, ensure_base_keys = [], ensure_supplemental_keys = [])
      unique_base_keys = calculate_unique_keys(base_data, supplemental_data, ensure_base_keys)
      unique_supplemental_keys = calculate_unique_keys(supplemental_data, base_data, ensure_supplemental_keys)

      base_data_fallback = unique_base_keys.index_with{nil}
      supplemental_data_fallback = unique_supplemental_keys.index_with{nil}

      [base_data_fallback, supplemental_data_fallback]
    end

    private def calculate_unique_keys(unique_from, compare_to, ensure_keys)
      ((unique_from&.first&.keys || []) + ensure_keys).uniq - (compare_to&.first&.keys || [])
    end
  end
end
