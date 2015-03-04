# Mixin to help generate a query for the progress reports
# and retrieve the results. Mix this in to your model
# class and define the required methods, then call
# Model.for_progress_report()
module ProgressReportQuery
  extend ActiveSupport::Concern
  # def self.progress_report_select
  # def self.progress_report_joins(filters)
  # def self.progress_report_group_by
  # def self.progress_report_order_by

  module ClassMethods
    def for_progress_report(teacher, filters)
      query = progress_report_base_query(teacher, filters)

      if filters[:classroom_id].present?
        query = query.where("classrooms.id = ?", filters[:classroom_id])
      end

      if filters[:student_id].present?
        query = query.where("activity_sessions.user_id = ?", filters[:student_id])
      end

      if filters[:unit_id].present?
        query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
      end

      if filters[:concept_category_id].present?
        query = query.where("concept_tag_results.concept_category_id IN (?)", filters[:concept_category_id])
      end

      if filters[:section_id].present?
        query = query.where('topics.section_id IN (?)', filters[:section_id])
        # query = query.where("topics.section_id = ?", filters[:section_id]) - Found in Topic model
      end

      if filters[:topic_id].present?
        query = query.where('topics.id IN (?)', filters[:topic_id])
      end

      get_query_results(query)
    end

    def progress_report_base_query(teacher, filters)
      query = select(progress_report_select)
              .joins(progress_report_joins(filters))
              .group(progress_report_group_by)
              .where("activity_sessions.state = ?", "finished")
              .where("classrooms.teacher_id = ?", teacher.id) # Always by teacher


      # if self.respond_to?(:progress_report_order_by)
        query = query.order(progress_report_order_by)
      # end
      query
    end

    def get_query_results(query)
      results = ActiveRecord::Base.connection.select_all(query)
      results.to_hash
    end
  end
end