class ProviderClassroomWithUnsyncedStudentsSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :unsynced_students
  self.root = false

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
