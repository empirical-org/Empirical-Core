class ClassroomActivitySerializer < ActiveModel::Serializer
  attributes :id, :classroom_id, :unit_id, :activity_id, :due_date,  :created_at, :updated_at, :formatted_due_date

  has_one :activity
  has_one :classroom


  def formatted_due_date
  	due_date = object.due_date
  	if due_date.present?
  		due_date.month.to_s + "-" + due_date.day.to_s + "-" + due_date.year.to_s
  	else
  		""
  	end
  end

end
