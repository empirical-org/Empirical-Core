namespace :rewrite_classroom_activities do
  desc 'create unit activities and classroom units from classroom activities'

  task :create_unit_activities_and_classroom_units  => :environment do
    ClassroomActivity.unscoped.all.each do |ca|
      begin
        ua = UnitActivity.find_or_create_by(
          unit_id: ca.unit_id,
          activity_id: ca.activity_id,
          visible: ca.visible,
          due_date: ca.due_date
        )
        cu = ClassroomUnit.find_or_create_by(
          unit_id: ca.unit_id,
          classroom_id: ca.classroom_id,
          visible: ca.visible,
          assigned_student_ids: ca.assigned_student_ids,
          assign_on_join: ca.assign_on_join
        )

        if cu && cu.id
          ca.activity_sessions.update_all(classroom_unit_id: cu.id)
        end

        if ca.activity.is_lesson? && cu && ua && cu.id && ua.id
          ClassroomUnitActivityState.find_or_create_by(
            unit_activity_id: ua.id,
            classroom_unit_id: cu.id,
            pinned: ca.pinned,
            locked: ca.locked,
            completed: ca.completed
          )
        end
      rescue Exception => e
        puts e.message
        puts e.backtrace.inspect
      end
    end
  end

end
