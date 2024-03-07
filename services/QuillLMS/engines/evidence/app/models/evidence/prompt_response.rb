# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id            :bigint           not null, primary key
#  embedding     :vector(1536)     not null
#  response_text :text             not null
#  prompt_id     :integer          not null
#

require 'neighbor'

module Evidence
  class PromptResponse < ApplicationRecord
    # Dimension and model are coupled: https://platform.openai.com/docs/guides/embeddings
    DIMENSION = 1536
    MODEL = 'text-embedding-3-small'

    belongs_to :prompt
    has_one :prompt_response_feedback, dependent: :destroy

    has_neighbors :embedding

    validates :response_text, presence: true
    validates :embedding, presence: true
    validates :prompt, presence: true

    before_validation :set_embedding

    delegate :feedback, to: :prompt_response_feedback, allow_nil: true

    private def set_embedding
      return if response_text.blank? || embedding.present?

      self.embedding = Evidence::OpenAI::EmbeddingFetcher.run(dimension: DIMENSION, input: response_text, model: MODEL)
    end
  end
end
