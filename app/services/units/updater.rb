module Units::Updater



  def self.run(id, activities_data, classrooms_data)
    unit = Unit.find(id)
    self.update_helper(unit, activities_data, classrooms_data)

  end



  def self.assign_unit_template_to_one_class(teacher_id, unit_template_id, classroom_id, student_ids=[])
    unit = Unit.find_by(name: UnitTemplate.find(unit_template_id).name, user_id: teacher_id)
    activities_data = unit.activities.map{ |a| {id: a.id, due_date: nil} }
    classrooms_data = [{id: classroom_id, student_ids: student_ids}]
    self.update_helper(teacher_id, unit, activities_data, classrooms_data)
  end

  private

  def self.update_helper(teacher_id, unit, activities_data, classrooms_data)

    # makes a permutation of each classroom with each activity to
    # create all necessary activity sessions
    product = activities_data.product(classrooms_data, activities_data)
    product.each do |pair|
      activity_data, classrooms_data = pair
      classroom_activity = unit.classroom_activities.find_by!(activity_id: activity_data[:id], classroom_id: classrooms_data[:id])
      previously_assigned_students = classroom_activity.assigned_student_ids || []
      all_assigned_students = previously_assigned_students.push(classrooms_data[:student_ids]).flatten.map(&:to_i).uniq
      classroom_activity.update(activity_id: activity_data[:id],
        due_date: activity_data[:due_date],
        classroom_id: classrooms_data[:id],
        assigned_student_ids: all_assigned_students)
    end



    #   unit.classroom_activities.find_or_create!(activity_id: activity_data[:id],
    #                                     due_date: activity_data[:due_date],
    #                                     classroom_id: classroom_data[:id],
    #                                     assigned_student_ids: classroom_data[:student_ids])
    # end
    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    # TODO: Assign Activity Worker should be labeled as an analytics worker
    AssignActivityWorker.perform_async(teacher_id)
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
