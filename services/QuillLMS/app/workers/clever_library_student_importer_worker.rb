class CleverLibraryStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(classroom_ids, token)
    client = CleverLibrary::Api::Client.new(token)
    Classroom.where(id: classroom_ids).each do |classroom|
      if classroom
        students_data = client.get_section_students(section_id: classroom.clever_id)
        if students_data && students_data.length
          students = CleverIntegration::Creators::Students.run(students_data.map do |student_data|
            {
              clever_id: student_data["id"],
              name: "#{student_data['name']['first']} #{student_data['name']['middle']} #{student_data['name']['last']}".squish,
              username: student_data["id"]
            }
          end)
          CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
        end
      end
    end
  end
end
