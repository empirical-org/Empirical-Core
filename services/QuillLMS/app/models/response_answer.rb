# frozen_string_literal: true

# == Schema Information
#
# Table name: response_answer_texts
#
#  id         :bigint           not null, primary key
#  text       :jsonb            not null
#  created_at :datetime         not null
#
class ResponseAnswer < ApplicationRecord
    has_many :responses

    # We use a JSON field here because Lessons abuses the unstructured
    # nature of old-style ConceptResults to stash arrays in this value
    validates :json, uniqueness: true, length: { minimum: 0, allow_nil: false }
end
