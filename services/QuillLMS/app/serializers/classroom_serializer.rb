class ClassroomSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :grade, :updated_at

end
