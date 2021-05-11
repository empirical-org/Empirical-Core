class ArchiveStudentAssociationsForClassroomWorker
  include Sidekiq::Worker
  
  def perform(student_id, classroom_id)
    ClassroomUnit
      .where(classroom_id: classroom_id)
      .where("classroom_units.assigned_student_ids @> '{?}'", ActiveRecord::Base.connection.quote(student_id))
      .each { |classroom_unit| classroom_unit.remove_assigned_student(student_id) }
  end
end
