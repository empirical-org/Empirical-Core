# frozen_string_literal: true

# == Schema Information
#
# Table name: response_prompt_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_prompt_texts_on_text  (text) UNIQUE
#
class ResponsePrompt < ApplicationRecord
  include IsResponseNormalizedText
end
