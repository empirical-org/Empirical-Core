class ClassroomActivitySerializer < ActiveModel::Serializer
  attributes :id, :classroom_id, :activity_id, :due_date,  :created_at, :updated_at

  has_one :activity
  has_one :classroom

end
