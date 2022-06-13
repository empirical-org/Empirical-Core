# frozen_string_literal: true

json.ignore_nil!

json.data do
  json.array! @schools do |school|
    json.id school.id
    json.type 'schools'
    json.attributes do
      json.text school.name
      json.zipcode school.zipcode || school.mail_zipcode
      json.street school.street || school.mail_street
      json.city school.city || school.mail_city
      json.state school.state || school.mail_state
      json.number_of_teachers school.number_of_teachers
    end
  end
end

json.ignore_nil! false

json.meta do
  json.lat @lat
  json.lng @lng
  json.search @search
  json.prefix @prefix
  json.zipcode @zipcode
  json.radius @radius
  json.limit @limit
  json.request_time DateTime.current.to_s
end
