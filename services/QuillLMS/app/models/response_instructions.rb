# frozen_string_literal: true

# == Schema Information
#
# Table name: response_instructions_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_instructions_texts_on_text  (text) UNIQUE
#
class ResponseInstructions < ApplicationRecord
  include IsResponseNormalizedText
end
