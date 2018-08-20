json.array! @notifications do |notification|
  json.text notification.text
  json.user notification.user.name
end
