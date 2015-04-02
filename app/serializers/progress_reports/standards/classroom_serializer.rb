class ProgressReports::Standards::ClassroomSerializer  < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :name,
             :total_student_count,
             :proficient_student_count,
             :near_proficient_student_count,
             :not_proficient_student_count,
             :total_standard_count,
             :students_href,
             :topics_href

  def total_standard_count
    object.unique_topic_count
  end

  def students_href
    teachers_progress_reports_standards_classroom_students_path(object.id)
  end

  def topics_href
    teachers_progress_reports_standards_classroom_topics_path(object.id)
  end
end