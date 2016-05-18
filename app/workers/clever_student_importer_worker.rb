class CleverStudentImporterWorker
  include Sidekiq::Worker

  def perform(classrooms, district_token, requesters)
    puts "Running Clever student import in the background"
    puts "Classrooms: #{classrooms}"
    puts "district_token #{district_token}"
    puts "requesters #{requesters}"
    CleverIntegration::Importers::Students.run(classrooms, district_token, requesters[:section_requester])
  end
end
