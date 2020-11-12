class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    teacher = User.find_by(id: id)
    if teacher
      #we don't want to trigger analtyics since this is used as a callback after login
      find_or_create_checkbox('Create a Classroom', teacher) if teacher.classrooms_i_own.any?
      find_or_create_checkbox('Add Students', teacher) if teacher.classrooms_i_own.find{|classroom| classroom.students.any?}
      #finds all types of assigned units and ensures they have checkboxes
      assigned_unit_types = teacher.units.map(&:unit_activities).flatten.map(&:checkbox_type).uniq.each{|type| find_or_create_checkbox(type, teacher)}
      find_or_create_checkbox('Add School', teacher) if teacher.school.present?
    end
  end

end
