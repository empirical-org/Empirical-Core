class Types::ChangeLogInput < Types::BaseInputObject
  argument :action, String, required: true
  argument :explanation, String, required: true
  argument :recordID, ID, required: false
  argument :previousValue, ID, required: false
  argument :newValue, ID, required: false
  argument :changedAttribute, ID, required: false
end
