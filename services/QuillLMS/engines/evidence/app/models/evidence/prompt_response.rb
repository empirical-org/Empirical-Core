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

    delegate :label, :label_transformed, to: :prompt_response_feedback

    def self.fetch_embedding(text) = Evidence::OpenAI::EmbeddingFetcher.run(input: text)

    def self.closest_prompt_texts(prompt_id, response_text, limit = 10)
      # TODO: replace this line with etch_embedding(response_text)
      # For testing efficiency, I stored embeddings on a different prompt
      embedding = find_by(prompt_id: 16, response_text:)

      embedding
        .nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
        .includes(:prompt_response_feedback)
        .where(prompt_id: prompt_id)
        .limit(limit)
        .map {|r| [r.response_text, r.label_transformed]}
    end

    def closest_prompt_response
      nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
        .where(prompt_id:)
        .first
    end

    def closest_feedback
      val = closest_prompt_response

      { distance: val&.neighbor_distance, feedback: val&.prompt_response_feedback&.feedback }
    end

    private def set_embedding
      return if response_text.blank? || embedding.present?

      self.embedding = self.class.fetch_embedding(response_text)
    end
  end
end
