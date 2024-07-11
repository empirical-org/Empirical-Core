# frozen_string_literal: true

module Units::Creator
  def self.run(teacher, name, activities_data, classrooms_data, unit_template_id=nil, current_user_id=nil)
    create_helper(teacher, name, activities_data, classrooms_data, unit_template_id, current_user_id)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template_id, current_user_id=nil)
    unit_template = UnitTemplate.find(unit_template_id)
    # unit fix: pass whole teacher object
    teacher = User.find(teacher_id)
    activities_data = RawSqlRunner.execute(
      <<-SQL
        SELECT activities.id
        FROM activities
        JOIN activities_unit_templates
          ON activities.id = activity_id
        WHERE unit_template_id = #{unit_template_id}
        ORDER BY activities_unit_templates.id;
      SQL
    ).map { |a| { id: a['id'], due_date: nil, publish_date: nil } }

    # unit fix: may be able to better optimize this one, but possibly not
    classrooms_data = teacher.classrooms_i_teach.map{ |c| {id: c.id, student_ids: [], assign_on_join: true} }
    create_helper(teacher, unit_template.name, activities_data, classrooms_data, unit_template_id, current_user_id)
  end

  def self.assign_unit_template_to_one_class(teacher_id, unit_template_id, classroom, current_user_id=nil)
    unit_template = UnitTemplate.find(unit_template_id)
    classroom_array = [classroom]
    # converted to array so we can map in helper function as we would otherwise
    # unit fix: pass whole teacher object
    teacher = User.find(teacher_id)
    activities_data = RawSqlRunner.execute(
      <<-SQL
        SELECT activities.id
        FROM activities
        JOIN activities_unit_templates
          ON activities.id = activity_id
        WHERE unit_template_id = #{unit_template_id}
        ORDER BY activities_unit_templates.id;
      SQL
    ).map { |a| {id: a['id'], due_date: nil}}

    create_helper(teacher, unit_template.name, activities_data, classroom_array, unit_template_id, current_user_id)
  end

  def self.create_helper(teacher, name, activities_data, classrooms, unit_template_id=nil, current_user_id)
    unit = Unit.create!(
      name: name,
      user: teacher,
      unit_template_id: unit_template_id
    )
    # makes a permutation of each classroom with each activity to
    # create all necessary activity sessions
    activities_data.uniq.each.with_index do |activity, index|
      act_data = {
        unit_id: unit.id,
        activity_id: activity[:id],
        due_date: activity[:due_date],
        publish_date: activity[:publish_date],
        order_number: index + 1
      }

      ua = UnitActivity.new
      ua.save_new_attributes_and_adjust_dates!(act_data)
    end

    classrooms.each do |classroom|
      ClassroomUnit.create!(
        classroom_id: classroom[:id],
        assigned_student_ids: classroom[:student_ids],
        assign_on_join: classroom[:assign_on_join],
        unit_id: unit.id
      )
    end

    unit.reload
    unit.save
    unit.email_lesson_plan

    AssignActivityWorker.perform_async((current_user_id || teacher.id), unit.id)
  end
end
