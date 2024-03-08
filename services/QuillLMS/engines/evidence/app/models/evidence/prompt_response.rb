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

    DISTANCE_METRIC = 'cosine'

    belongs_to :prompt
    has_one :prompt_response_feedback, dependent: :destroy

    has_neighbors :embedding

    validates :response_text, presence: true
    validates :embedding, presence: true
    validates :prompt, presence: true

    before_validation :set_embedding

    def closest_prompt_response
      @closest_prompt_response ||= begin
        nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
          .where(prompt_id:)
          .first
      end
    end

    def closest_feedback
      {
        distance: closest_prompt_response&.neighbor_distance,
        feedback: closest_prompt_response&.prompt_response_feedback&.feedback
      }
    end

    private def set_embedding
      return if response_text.blank? || embedding.present?

      self.embedding = Evidence::OpenAI::EmbeddingFetcher.run(dimension: DIMENSION, input: response_text, model: MODEL)
    end
  end
end
