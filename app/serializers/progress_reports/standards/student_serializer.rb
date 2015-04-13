class ProgressReports::Standards::StudentSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attr_accessor :classroom_id

  attributes :name,
             :id,
             :sorting_name,
             :total_standard_count,
             :proficient_standard_count,
             :near_proficient_standard_count,
             :not_proficient_standard_count,
             :total_activity_count,
             :average_score,
             :student_topics_href,
             :mastery_status

  def average_score
    object.average_score.round(2)
  end

  def student_topics_href
    return '' unless classroom_id.present?
    teachers_progress_reports_standards_classroom_student_topics_path(
      student_id: object.id,
      classroom_id: classroom_id)
  end

  def mastery_status
    if average_score >= 0.75
      "Proficient"
    elsif average_score < 0.75 and average_score >= 0.5
      "Nearly Proficient"
    else
      "Not Proficient"
    end
  end
end