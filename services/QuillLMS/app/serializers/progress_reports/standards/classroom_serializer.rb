# frozen_string_literal: true

class ProgressReports::Standards::ClassroomSerializer  < ApplicationSerializer
  include Rails.application.routes.url_helpers

  attributes :name,
             :total_student_count,
             :proficient_student_count,
             :not_proficient_student_count,
             :total_standard_count,
             :students_href,
             :standards_href

  def total_standard_count
    object.unique_standard_count
  end

  def students_href
    teachers_progress_reports_standards_classroom_students_path(object.id)
  end

  def standards_href
    teachers_progress_reports_standards_classroom_standards_path(object.id)
  end
end
