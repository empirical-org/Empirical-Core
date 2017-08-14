class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    teacher = User.find id
    flag = 'no analytics'
    #we don't want to trigger analtyics since this is used as a callback after login
    find_or_create_checkbox('Create a Classroom', teacher, flag) if (teacher.classrooms_i_teach.any?)
    find_or_create_checkbox('Add Students', teacher, flag) if teacher.students.any?
    #finds all types of assigned units and ensures they have checkboxes
    assigned_unit_types = teacher.classrooms_i_teach.map(&:classroom_activities).flatten.map(&:checkbox_type).uniq.each{|type| find_or_create_checkbox(type, teacher)}
    find_or_create_checkbox('Add School', teacher) if teacher.school?
  end




end
