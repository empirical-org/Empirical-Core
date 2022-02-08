# frozen_string_literal: true

module CleverIntegration::Associators::StudentsToClassroom

  def self.run(students, classroom)
    students.map do |student|
      ::Associators::StudentsToClassrooms.run(student, classroom)
    end

  end
end