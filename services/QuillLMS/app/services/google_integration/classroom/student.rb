# frozen_string_literal: true

module GoogleIntegration::Classroom::Student

  def self.run(user, google_classroom_ids)
    return if google_classroom_ids.empty?

    classrooms = Classroom.where(google_classroom_id: google_classroom_ids)
    classrooms.each { |c| join_classroom(user, c)}
  end

  def self.join_classroom(user, classroom)
    Associators::StudentsToClassrooms.run(user, classroom)
  end
end
