class Types::ChangeLogInput < Types::BaseInputObject
  argument :action, String, required: true
  argument :explanation, String, required: true
  argument :conceptID, ID, required: false
end
