class ProgressReports::Standards::StudentSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attr_accessor :classroom_id

  attributes :name,
             :total_standard_count,
             :proficient_standard_count,
             :near_proficient_standard_count,
             :not_proficient_standard_count,
             :total_activity_count,
             :average_score,
             :student_topics_href


  def student_topics_href
    teachers_progress_reports_standards_classroom_student_topics_path(
      student_id: object.id,
      classroom_id: classroom_id)
  end
end