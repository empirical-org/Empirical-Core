module Units::Creator
  def self.run(teacher, name, activities_data, classrooms_data, unit_template_id=nil, current_user_id=nil)
    self.create_helper(teacher, name, activities_data, classrooms_data, unit_template_id, current_user_id)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template_id, current_user_id=nil)
    # unit fix: pass whole teacher object
    teacher = User.find(teacher_id)
    # this call is unnecessary as we can do sql without it
    unit_template = UnitTemplate.find(unit_template_id)
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil} }
    # unit fix: may be able to better optimize this one, but possibly not
    classrooms_data = teacher.classrooms_i_teach.map{ |c| {id: c.id, student_ids: [], assign_on_join: true} }
    self.create_helper(teacher, unit_template.name, activities_data, classrooms_data, unit_template_id, current_user_id)
  end

  def self.assign_unit_template_to_one_class(teacher_id, unit_template_id, classroom, current_user_id=nil)
    classroom_array = [classroom]
    # converted to array so we can map in helper function as we would otherwise
    # unit fix: pass whole teacher object
    teacher = User.find(teacher_id)
    # this call is unnecessary as we can do sql without it
    unit_template = UnitTemplate.find(unit_template_id)
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil} }
    self.create_helper(teacher, unit_template.name, activities_data, classroom_array, unit_template_id, current_user_id)
  end

  private

  def self.create_helper(teacher, name, activities_data, classrooms, unit_template_id=nil, current_user_id)
    unit = Unit.create!(name: name, user: teacher, unit_template_id: unit_template_id)
    # makes a permutation of each classroom with each activity to
    # create all necessary activity sessions
    classrooms.each do |classroom|
      product = activities_data.product([classroom[:id].to_i]).uniq
      product.each do |pair|
        activity_data, classroom_id = pair
        new_ca = unit.classroom_activities.create!(activity_id: activity_data[:id],
                                          due_date: activity_data[:due_date],
                                          classroom_id: classroom_id,
                                          assigned_student_ids: classroom[:student_ids],
                                          assign_on_join: classroom[:assign_on_join]
                                        )
      end
    end

    unit.email_lesson_plan
    # unit.hide_if_no_visible_classroom_activities
    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    AssignActivityWorker.perform_async(current_user_id || teacher.id)
    GoogleIntegration::Announcements.post_unit(unit)
  end
end
