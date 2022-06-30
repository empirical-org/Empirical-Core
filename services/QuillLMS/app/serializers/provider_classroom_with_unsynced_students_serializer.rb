# frozen_string_literal: true

class ProviderClassroomWithUnsyncedStudentsSerializer < ApplicationSerializer
  attributes :id, :name, :code, :unsynced_students

  def as_json(*_options)
    super(root: false)
  end

  def unsynced_students
    object.unsynced_students.map do |student|
      {
        id: student.id,
        name: student.name,
        email: student.email
      }
    end
  end
end

