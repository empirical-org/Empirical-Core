class ClassroomSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :grade

  # has_one :teacher, serializer: TeacherSerializer

end
