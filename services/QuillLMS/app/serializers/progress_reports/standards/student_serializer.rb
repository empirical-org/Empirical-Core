# frozen_string_literal: true

class ProgressReports::Standards::StudentSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attr_accessor :classroom_id

  attributes :name,
             :id,
             :sorting_name,
             :total_standard_count,
             :proficient_standard_count,
             :not_proficient_standard_count,
             :total_activity_count,
             :timespent,
             :average_score,
             :student_standards_href,
             :mastery_status

  def average_score
    object.average_score&.round(2) || 0
  end

  def student_standards_href
    return '' unless classroom_id.present?

    teachers_progress_reports_standards_classroom_student_standards_path(
      student_id: object.id,
      classroom_id: classroom_id)
  end

  def mastery_status
    ProficiencyEvaluator.evaluate(average_score)
  end
end
