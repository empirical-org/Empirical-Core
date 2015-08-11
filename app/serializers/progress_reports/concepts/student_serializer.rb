class ProgressReports::Concepts::StudentSerializer  < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :name,
             :concepts_href,
             :total_result_count,
             :correct_result_count,
             :incorrect_result_count

  def concepts_href
    teachers_progress_reports_concepts_student_concepts_path(student_id: object.id)
  end
end