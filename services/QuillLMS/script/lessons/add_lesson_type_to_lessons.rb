# frozen_string_literal: true

PERMITTED_TYPES = ["questions","sentenceFragments","fillInBlank","titleCards"]

Lesson.all.each do |lesson|
  data = lesson.data
  if data["questions"].blank?
    next
  end

  first_question = data["questions"][0]
  question_type = first_question["questionType"]
  if question_type && question_type.empty?
    puts "Found a blank question type on lesson #{lesson.uid}"
  elsif !PERMITTED_TYPES.include? question_type
    raise "Error - the question type #{question_type} on lesson #{lesson.uid} is not permitted."
  end
  data["questionType"] = question_type
  lesson.data = data
  lesson.save
end
