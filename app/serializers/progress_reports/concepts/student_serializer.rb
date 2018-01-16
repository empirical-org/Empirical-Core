class ProgressReports::Concepts::StudentSerializer  < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :name,
             :concepts_href,
             :total_result_count,
             :correct_result_count,
             :incorrect_result_count,
             :percentage,
             :id

  def concepts_href
    teachers_progress_reports_concepts_student_concepts_path(student_id: object.id)
  end

  def percentage
    (object.correct_result_count.to_f * 100 / object.total_result_count).round
  end
end
