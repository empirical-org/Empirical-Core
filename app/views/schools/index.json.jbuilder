json.array! @schools do |school|
  json.id school.id
  json.text school.name
end
