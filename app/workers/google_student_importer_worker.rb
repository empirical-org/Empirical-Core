class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(teacher_id, access_token)
    puts "Running Google student import in the background"
    client = GoogleIntegration::Client.create(access_token)
    students_requester = GoogleIntegration::Classroom::Requesters::Students.generate(client)
    classrooms = User.find(teacher_id).google_classrooms.to_a
    puts 'here are the classrooms'
    puts classrooms.to_s
    GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
  end
end
