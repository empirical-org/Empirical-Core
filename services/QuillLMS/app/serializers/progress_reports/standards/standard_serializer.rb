# frozen_string_literal: true

class ProgressReports::Standards::StandardSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  attr_accessor :classroom_id

  attributes :name,
             :id,
             :standard_level_name,
             :total_student_count,
             :proficient_student_count,
             :not_proficient_student_count,
             :total_activity_count,
             :timespent,
             :average_score,
             :standard_students_href,
             :mastery_status,
             :is_evidence

  # rubocop:disable Naming/PredicateName
  def is_evidence
    !!object.try(:is_evidence)
  end
  # rubocop:enable Naming/PredicateName

  def average_score
    object.average_score&.round(2) || 0
  end

  def standard_students_href
    return '' unless classroom_id.present?

    teachers_progress_reports_standards_classroom_standard_students_path(
      standard_id: object.id,
      classroom_id: classroom_id)
  end

  def mastery_status
    ProficiencyEvaluator.evaluate(average_score)
  end

end
