# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_answer_texts
#
#  id         :bigint           not null, primary key
#  text       :jsonb            not null
#  created_at :datetime         not null
#
class StudentResponseAnswerText < ApplicationRecord
  include IsStudentResponseNormalizedText
end
