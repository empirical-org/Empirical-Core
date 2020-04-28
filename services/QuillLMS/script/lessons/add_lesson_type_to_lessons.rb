PERMITTED_TYPES = ["questions","sentenceFragments","fillInBlank","titleCards"]

Lesson.all.each do |lesson|
  data = lesson.data
  if data["questions"].blank?
    next
  end
  first_question = data["questions"][0]
  question_type = first_question["questionType"]
  if !PERMITTED_TYPES.include? question_type
    raise "Error - the question type #{question_type} is not permitted."
  end
  data["questionType"] = question_type
  lesson.data = data
  lesson.save
end