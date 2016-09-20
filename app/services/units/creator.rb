module Units::Creator

  #    activities_data: [{
  #       id: int
  #       due_date: string | nil
  #     }]
  #     classrooms_data: [{
  #       id: int
  #       student_ids: Array
  #     }]
  def self.run(teacher, name, activities_data, classrooms_data)
    self.create_helper(teacher, name, activities_data, classrooms_data)
  end

  def self.fast_assign_unit_template(id, unit_template_id)
    teacher = User.find(id)
    unit_template = UnitTemplate.find(unit_template_id)
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil} }
    classrooms_data = teacher.classrooms_i_teach.map{ |c| {id: c.id, student_ids: []} }
    self.create_helper(teacher, unit_template.name, activities_data, classrooms_data)
  end

  def self.assign_unit_template_to_one_class(teacher_id, unit_template_id, classroom_id, student_ids=[])
    teacher = User.find(teacher_id)
    unit_template = UnitTemplate.find(unit_template_id)
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil} }
    classrooms_data = [{id: classroom_id, student_ids: student_ids}]
    self.create_helper(teacher, unit_template.name, activities_data, classrooms_data)
  end

  private

  def self.create_helper(teacher, name, activities_data, classrooms_data)
    unit = Unit.create(name: name)
    product = activities_data.product(classrooms_data)
    product.each do |pair|
      activity_data, classroom_data = pair
      unit.classroom_activities.create!(activity_id: activity_data[:id],
                                        due_date: activity_data[:due_date],
                                        classroom_id: classroom_data[:id],
                                        assigned_student_ids: classroom_data[:student_ids])
    end
    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    AssignActivityWorker.perform_async(teacher.id)
  end


end
