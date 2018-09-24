json.array! @notifications do |notification|
  json.text notification.text
  json.href notification.activity_student_report_path
end
