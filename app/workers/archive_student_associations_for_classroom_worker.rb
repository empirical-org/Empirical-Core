class ArchiveStudentAssociationsForClassroomWorker
  include Sidekiq::Worker

  def perform(student_id, classroom_id)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_id).where.contains(assigned_student_ids: [student_id])
    classroom_units.each do |cu|
      cu.remove_assigned_student(student_id)
    end
  end

end
