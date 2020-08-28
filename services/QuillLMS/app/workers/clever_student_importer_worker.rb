class CleverStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL


  def perform(classroom_ids, district_token)
    classrooms = Classroom.unscoped.where(id: classroom_ids)
    CleverIntegration::Importers::Students.run(classrooms, district_token)
  end
end
