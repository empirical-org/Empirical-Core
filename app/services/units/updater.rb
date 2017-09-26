module Units::Updater


  # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
  # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
  # and array of student ids.

  # TODO: rename this -- it isn't always the method called on the instance
  def self.run(unit_id, activities_data, classrooms_data)
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  def self.assign_unit_template_to_one_class(unit_id, classrooms_data)
    activities_data = ClassroomActivity.where(unit_id: unit_id).select('activity_id AS id, NULL as due_date')
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template, unit_id)
    activities_data = unit_template.activities.select('activity_id AS id, NULL as due_date')
    classrooms_data = Classroom.where(teacher_id: teacher_id).ids.map{|id| {id: id, student_ids: []}}
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  private

  def self.matching_or_new_classroom_activity(activity_data, classroom_id, extant_classroom_activities, new_cas, hidden_cas_ids, classroom, unit_id)
    visible = classroom[:student_ids] != false
    matching_activity = extant_classroom_activities.find{|ca| (ca.activity_id == activity_data[:id] && ca.classroom_id == classroom_id)}
    if matching_activity
      if !visible
        # then there are no assigned students and we should hide the cas
        puts 'here is the info ryan'
        puts activity_data
        puts classrooms[:student_ids]
        hidden_cas_ids.push(matching_activity.id)
      elsif (matching_activity[:due_date] != activity_data[:due_date]) || (matching_activity.assigned_student_ids != classroom[:student_ids])
        # then something changed and we should update
        matching_activity.update!(due_date: activity_data[:due_date], assigned_student_ids: classroom[:student_ids])
      end
    elsif visible
      # making an array of hashes to create in one bulk option
      new_cas.push({activity_id: activity_data[:id],
         classroom_id: classroom_id,
         unit_id: unit_id,
         due_date: activity_data[:due_date],
         assigned_student_ids: classroom[:student_ids]})
    end
  end

  def self.update_helper(unit_id, activities_data, classrooms_data)
    # makes a permutation of each classroom with each activity to
    # create all necessary activity sessions
    unit = Unit.find unit_id
    classrooms_data.each do |classroom|
      product = activities_data.product([classroom[:id].to_i])
      product.each do |pair|
        activity_data, classroom_id = pair
        # units fix: probably better off loading each of these into memory one time before using the products
        classroom_activity = unit.classroom_activities.find_or_initialize_by(activity_id: activity_data[:id], classroom_id: classroom_id)
        if classroom[:student_ids] === false
          # units fix: add this ca to a blacklisted array which will be bulk updated to visible false
          # still use next
          classroom_activity.update(visible: false)
          next
        end

        if classroom_activity.new_record?
          # TODO: look further into what is going on with due date
          due_date = classroom_activity.sibling_due_date || activity_data[:due_date]
          classroom_activity.save
        else
          due_date = activity_data[:due_date] || classroom_activity.due_date
        end
        # units fix: add these to an array or hash for a bulk update at the end
        classroom_activity.update(due_date: due_date, assigned_student_ids: classroom[:student_ids])
      end
    end
    unit.hide_if_no_visible_classroom_activities
    # necessary activity sessions are created in an after_create and after_save callback
    # in activity_sessions.rb
    # TODO: Assign Activity Worker should be labeled as an analytics worker
    AssignActivityWorker.perform_async(unit.user_id)
  end

  # def self.update_helper(unit_id, activities_data, classrooms_data)
  #   unit = Unit.find unit_id
  #   extant_classroom_activities = ClassroomActivity.where(unit_id: unit_id)
  #   new_cas = []
  #   hidden_cas_ids = []
  #   classrooms_data.each do |classroom|
  #       product = activities_data.product([classroom[:id].to_i])
  #       product.each do |pair|
  #         activity_data, classroom_id = pair
  #         self.matching_or_new_classroom_activity(activity_data, classroom_id, extant_classroom_activities, new_cas, hidden_cas_ids, classroom, unit_id)
  #       end
  #   end
  #   # TODO: this is messing everything up by not generating new activity sessions since it skips the callback
  #   # however, it is far more efficient
  #   # new_cas.any? ? ClassroomActivity.bulk_insert(values: new_cas) : nil
  #   new_cas.each{|ca| ClassroomActivity.create(ca)}
  #   # TODO: same as above -- efficient, but we need the callbacks
  #   # hidden_cas_ids.any? ? ClassroomActivity.where(id: hidden_cas_ids).update_all(visible: false) : nil
  #   hidden_cas_ids.each{|ca_id| ClassroomActivity.find(ca_id).update(visible: false)}
  #   if (hidden_cas_ids.any?) && (new_cas.none?)
  #     # then there is a chance that there are no existing classroom activities
  #     unit.hide_if_no_visible_classroom_activities
  #   end
  #   # necessary activity sessions are created in an after_create and after_save callback
  #   # in activity_sessions.rb
  #   # TODO: Assign Activity Worker should be labeled as an analytics worker
  #   AssignActivityWorker.perform_async(unit.user_id)
  # end

end
