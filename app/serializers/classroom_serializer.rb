class ClassroomSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :grade, :updated_at

  # has_one :teacher, serializer: TeacherSerializer

end
