class ProgressReports::SectionSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id,
    :section_name,
    :topics_count,
    :proficient_count,
    :not_proficient_count,
    :total_time_spent,
    :section_link

  def section_link
    teachers_progress_reports_section_topics_path(object.id)
  end
end