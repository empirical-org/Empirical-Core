class AdminRelationship < ActiveRecord::Base

  belongs_to :admin, class_name: "User"
  belongs_to :teacher, class_name: "User"

end
