# frozen_string_literal: true

# == Schema Information
#
# Table name: response_directions_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_directions_texts_on_text  (text) UNIQUE
#
class ResponseDirections < ApplicationRecord
  include IsResponseNormalizedText
end
