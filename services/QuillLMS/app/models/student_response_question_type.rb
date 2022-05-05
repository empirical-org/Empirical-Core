# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_question_types
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_student_response_question_types_on_text  (text) UNIQUE
#
class StudentResponseQuestionType < ApplicationRecord
  include IsStudentResponseNormalizedText
end
