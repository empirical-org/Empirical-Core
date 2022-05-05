# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_prompt_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_student_response_prompt_texts_on_text  (text) UNIQUE
#
class StudentResponsePromptText < ApplicationRecord
  include IsStudentResponseNormalizedText
end
