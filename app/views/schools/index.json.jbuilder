json.array! @schools do |school|
  json.id school.id
  json.text school.name
  json.zipcode school.zipcode
end
