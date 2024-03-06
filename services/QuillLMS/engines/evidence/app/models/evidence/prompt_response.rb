# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id        :integer          not null, primary key
#  embedding :vector(1536)     not null
#  text      :text             not null
#
# Indexes
#
#  index_evidence_prompt_responses_on_text  (text) UNIQUE
#

require 'neighbor'

module Evidence
  class PromptResponse < ApplicationRecord
    # Dimension and model are coupled: https://platform.openai.com/docs/guides/embeddings
    DIMENSION = 1536
    MODEL = 'text-embedding-3-small'

    validates :text, presence: true, uniqueness: true
    validates :embedding, presence: true

    has_neighbors :embedding

    before_validation :set_embedding

    private def set_embedding
      return if text.blank? || embedding.present?

      self.embedding = Evidence::OpenAI::EmbeddingFetcher.run(dimension: DIMENSION, input: text, model: MODEL)
    end
  end
end
