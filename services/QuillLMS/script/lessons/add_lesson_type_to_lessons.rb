PERMITTED_TYPES = ["questions","sentenceFragments","fillInBlank","titleCards"]

Lesson.all.each do |lesson|
  data = lesson.data
  if data["questions"].blank?
    next
  end
  first_question = data["questions"][0]
  questionType = first_question["questionType"]
  if !PERMITTED_TYPES.include? questionType
    raise "Error - the question type #{questionType} is not permitted."
  end
  data["questionType"] = questionType
  lesson.data = data
  lesson.save
end