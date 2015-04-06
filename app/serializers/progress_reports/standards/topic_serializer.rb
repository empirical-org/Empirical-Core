class ProgressReports::Standards::TopicSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attr_accessor :classroom_id

  attributes :name,
             :id,
             :section_name,
             :total_student_count,
             :proficient_student_count,
             :near_proficient_student_count,
             :not_proficient_student_count,
             :total_activity_count,
             :average_score,
             :topic_students_href


  def topic_students_href
    teachers_progress_reports_standards_classroom_topic_students_path(
      topic_id: object.id,
      classroom_id: classroom_id)
  end
end