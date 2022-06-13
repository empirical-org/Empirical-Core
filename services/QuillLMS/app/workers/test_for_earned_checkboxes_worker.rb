# frozen_string_literal: true

class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker
  include CheckboxCallback

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(id)
    teacher = User.find_by(id: id)
    return unless teacher

    #we don't want to trigger analtyics since this is used as a callback after login
    find_or_create_checkbox(Objective::CREATE_A_CLASSROOM, teacher) if teacher.classrooms_i_teach.any?
    find_or_create_checkbox(Objective::ADD_STUDENTS, teacher) if teacher.classrooms_i_teach.find{|classroom| classroom.students.any?}
    #finds all types of assigned units and ensures they have checkboxes
    assigned_unit_types = teacher.units.map(&:unit_activities).flatten.map(&:checkbox_type).uniq.each{|type| find_or_create_checkbox(type, teacher)}
    find_or_create_checkbox('Add School', teacher) if teacher.school.present?
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
