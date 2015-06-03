json.array! @schools do |school|
  json.id school.id
  json.text school.name
  json.zipcod school.zipcode
end
