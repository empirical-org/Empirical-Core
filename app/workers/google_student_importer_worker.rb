class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(classrooms, access_token)
    puts "Running Google student import in the background"
    client = GoogleIntegration::Client.create(access_token)
    students_requester = GoogleIntegration::Classroom::Requesters::Students.generate(client)
    GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
  end
end
