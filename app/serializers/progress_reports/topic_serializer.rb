class ProgressReports::TopicSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :topic_id,
    :topic_name,
    :students_count,
    :proficient_count,
    :not_proficient_count,
    :total_time_spent,
    :students_href

  def students_href
    teachers_progress_reports_section_topic_students_path(
      section_id: object.section_id, topic_id: object.topic_id
    )
  end
end