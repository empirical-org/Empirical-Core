json.ignore_nil!

json.data do
  json.array! @schools do |school|
    json.id school.id
    json.type 'schools'
    json.attributes do
      json.text school.name
      json.zipcode school.zipcode
      json.street school.street
      json.city school.city
      json.state school.state
    end
  end
end

json.ignore_nil! false

json.meta do
  json.lat @lat
  json.lng @lng
  json.prefix @prefix
  json.radius @radius
  json.limit @limit
  json.request_time DateTime.now.to_s
end
