module Units::Updater


  # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
  # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
  # and array of student ids.

  # TODO: rename this -- it isn't always the method called on the instance
  def self.run(unit_id, activities_data, classrooms_data)
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  def self.assign_unit_template_to_one_class(unit_id, classrooms_data)
    # unit fix: this should just be a sql query
    activities_data = unit.activities.map{ |a| {id: a.id, due_date: nil} }
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template, unit_id)
    teacher = User.find(teacher_id)
    # unit fix: this should be a sql query
    activities_data = unit_template.activities.map{ |a| {id: a.id, due_date: nil} }
    # unit fix: classrooms data can be a sql query
    classrooms_data = teacher.classrooms_i_teach.map{ |c| {id: c.id, student_ids: []} }
    self.update_helper(unit_id, activities_data, classrooms_data)
  end

  private


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







  #TODO: find out if this code is worth salvaging
  # def self.run(teacher, id, name, activities_data, classrooms_data)
  #   extant = Unit.find(id)
  #   extant.update(name: name)
  #   classroom_activities = extant.classroom_activities
  #   pairs = activities_data.product(classrooms_data)
  #   self.create_and_update_cas(classroom_activities, pairs)
  #   self.hide_cas(classroom_activities, pairs)
  #   self.create_activity_sessions(extant)
  # end
  #
  # private
  #
  # def self.create_and_update_cas(classroom_activities, pairs)
  #   pairs.each do |pair|
  #     activity_data, classroom_data = pair
  #     hash = {activity_id: activity_data[:id], classroom_id: classroom_data[:id]}
  #     ca = classroom_activities.find_by(hash)
  #     if ca.present?
  #       self.maybe_hide_some_activity_sessions(ca, classroom_data[:student_ids])
  #     else
  #       ca = classroom_activities.create(hash)
  #     end
  #     ca.update(due_date: activity_data[:due_date], assigned_student_ids: classroom_data[:student_ids])
  #   end
  # end
  #
  # def self.maybe_hide_some_activity_sessions(classroom_activity, new_assigned_student_ids)
  #
  #   all_student_ids = classroom_activity.classroom.students.map(&:id)
  #   formerly_assigned = self.helper(classroom_activity.assigned_student_ids, all_student_ids)
  #   now_assigned = self.helper(new_assigned_student_ids, all_student_ids)
  #
  #   no_longer_assigned = formerly_assigned - now_assigned
  #   no_longer_assigned.each do |student_id|
  #     as = classroom_activity.activity_sessions.find_by(user_id: student_id)
  #     self.hide_activity_session(as)
  #   end
  # end
  #
  # def self.helper(student_ids1, student_ids2)
  #   student_ids1.any? ? student_ids1 : student_ids2
  # end
  #
  # def self.hide_activity_session(activity_session)
  #   Units::Hiders::ActivitySession.run(activity_session)
  # end
  #
  # def self.hide_cas(classroom_activities, pairs)
  #   classroom_activities.each do |ca|
  #     self.maybe_hide_ca(ca, pairs)
  #   end
  # end
  #
  # def self.maybe_hide_ca(ca, pairs)
  #   e = pairs.find do |pair|
  #     activity_data, classroom_data = pair
  #     a = (activity_data[:id] == ca.activity_id)
  #     b = (classroom_data[:id] == ca.classroom_id)
  #     a && b
  #   end
  #   if e.nil?
  #     self.hide_classroom_activity(ca)
  #   end
  # end
  #
  # def self.hide_classroom_activity(classroom_activity)
  #   Units::Hiders::ClassroomActivity.run(classroom_activity)
  # end
  #
  # def self.create_activity_sessions(unit)
  #   unit.reload.classroom_activities.each do |ca|
  #     ca.assign_to_students
  #   end
  # end

end
