# frozen_string_literal: true

module Units::Updater
  # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
  # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
  # and array of student ids.

  # TODO: rename this -- it isn't always the method called on the instance
  def self.run(unit_id, activities_data, classrooms_data, current_user_id=nil)
    update_helper(unit_id, activities_data, classrooms_data, current_user_id)
  end

  def self.assign_unit_template_to_one_class(unit_id, classrooms_data, unit_template_id, current_user_id=nil, concatenate_existing_student_ids: false)
    classroom_array = [classrooms_data]
    # converted to array so we can map in helper function as we would otherwise
    unit_template = UnitTemplate.find(unit_template_id)
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil, publish_date: nil} }
    update_helper(unit_id, activities_data, classroom_array, current_user_id, concatenate_existing_student_ids: concatenate_existing_student_ids)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template, unit_id, current_user_id=nil)
    activities_data = unit_template.activities.select('activities.id AS id, NULL as due_date, NULL as publish_date')
    classrooms_data = User.find(teacher_id).classrooms_i_teach.map{|classroom| {id: classroom.id, student_ids: [], assign_on_join: true}}
    update_helper(unit_id, activities_data, classrooms_data, current_user_id || teacher_id)
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.matching_or_new_classroom_unit(classroom, existing_classroom_units, new_cus, hidden_cus_ids, unit_id, concatenate_existing_student_ids)
    classroom_id = classroom[:id].to_i || classroom['id'].to_i
    matching_cu = existing_classroom_units.find{|cu| cu.classroom_id == classroom_id}
    if matching_cu
      if classroom[:student_ids] == false
        # then there are no assigned students and we should hide the cas
        hidden_cus_ids.push(matching_cu.id)
      elsif (matching_cu.assigned_student_ids != classroom[:student_ids]) || matching_cu.assign_on_join != classroom[:assign_on_join]
        # then something changed and we should update
        new_recipients = classroom[:student_ids] - matching_cu.assigned_student_ids
        new_student_ids = concatenate_existing_student_ids ? matching_cu.assigned_student_ids.concat(classroom[:student_ids]).uniq : classroom[:student_ids]
        matching_cu.update!(assign_on_join: classroom[:assign_on_join], assigned_student_ids: new_student_ids, visible: true)
      elsif !matching_cu.visible
        matching_cu.update!(visible: true)
      end
    elsif classroom[:student_ids] || classroom[:assign_on_join]
      # making an array of hashes to create in one bulk option
      new_cus.push({classroom_id: classroom_id,
         unit_id: unit_id,
         assign_on_join: classroom[:assign_on_join],
         assigned_student_ids: classroom[:student_ids]})
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.matching_or_new_unit_activity(activity_data, existing_unit_activities, new_uas, hidden_ua_ids, unit_id, order_number)
    activity_data_id = activity_data[:id].to_i || activity_data['id'].to_i
    activity_data_due_date = activity_data[:due_date] || activity_data['due_date']
    activity_data_publish_date = activity_data[:publish_date] || activity_data['publish_date']
    matching_ua = existing_unit_activities.find{|ua| (ua.activity_id == activity_data_id )}
    if matching_ua
      matching_ua.update!(visible: true,
        due_date: activity_data_due_date || matching_ua.due_date,
        publish_date: activity_data_publish_date || matching_ua.publish_date,
        order_number: order_number)
    elsif activity_data_id
      # making an array of hashes to create in one bulk option
      new_uas.push({activity_id: activity_data_id,
         unit_id: unit_id,
         due_date: activity_data_due_date,
         publish_date: activity_data_publish_date,
         order_number: order_number})
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.update_helper(unit_id, activities_data, classrooms_data, current_user_id, concatenate_existing_student_ids: false)
    existing_classroom_units = ClassroomUnit.where(unit_id: unit_id)
    new_cus = []
    hidden_cus_ids = []
    existing_unit_activities = UnitActivity.where(unit_id: unit_id)
    new_uas = []
    hidden_ua_ids = []
    classrooms_data.each do |classroom|
      matching_or_new_classroom_unit(classroom, existing_classroom_units, new_cus, hidden_cus_ids, unit_id, concatenate_existing_student_ids)
    end
    activities_data.each_with_index do |activity, index|
      order_number = index + 1
      matching_or_new_unit_activity(activity, existing_unit_activities, new_uas, hidden_ua_ids, unit_id, order_number)
    end
    new_cus = new_cus.uniq { |cu| cu['classroom_id'] || cu[:classroom_id] }
    new_uas = new_uas.uniq { |ua| ua['activity_id'] || ua[:activity_id] }
    new_cus.each { |cu| ClassroomUnit.create(cu) }

    ClassroomUnit.where(id: hidden_cus_ids).update_all(visible: false)
    UnitActivity.create(new_uas)
    UnitActivity.where(id: hidden_ua_ids).update_all(visible: false)
    unit = Unit.find(unit_id)
    unit.save
    if (hidden_ua_ids.any?) && (new_uas.none?)
      unit.hide_if_no_visible_unit_activities
    end
    AssignActivityWorker.perform_async(current_user_id, unit_id)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
