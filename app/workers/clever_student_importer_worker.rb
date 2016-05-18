class CleverStudentImporterWorker
  include Sidekiq::Worker

  def perform(classroom_ids, district_token)
    puts "Running Clever student import in the background"
    classrooms = Classroom.unscoped.where(id: classroom_ids)
    CleverIntegration::Importers::Students.run(classrooms, district_token, CleverIntegration::Requesters.section)
  end
end
