class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    puts id
    teacher = User.find id
    find_or_create_checkbox('Create a Classroom', teacher) if (teacher.classrooms_i_teach && teacher.classrooms_i_teach.any?)
    find_or_create_checkbox('Add Students', teacher) if teacher.students
    #runs the save callback for each classroom_activity, which tests for existing units
    teacher.classrooms_i_teach.map(&:classroom_activities).flatten.each {|ca| ca.save} unless teacher.classrooms_i_teach.map(&:classroom_activities).flatten.empty?
    find_or_create_checkbox('Add School', teacher) if teacher.schools.any?
  end




end
