# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_labeled_entries
#
#  id         :bigint           not null, primary key
#  embedding  :vector(1536)     not null
#  entry      :text             not null
#  label      :text             not null
#  metadata   :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  prompt_id  :integer          not null
#
# Indexes
#
#  index_evidence_labeled_entries_on_prompt_id  (prompt_id)
#

require 'neighbor'

module Evidence
  class LabeledEntry < ApplicationRecord
    # Dimension and model are coupled: https://platform.openai.com/docs/guides/embeddings
    DIMENSION = 1536
    MODEL = 'text-embedding-3-small'

    DISTANCE_METRIC = 'cosine'

    belongs_to :prompt

    has_neighbors :embedding

    validates :embedding, presence: true
    validates :label, presence: true
    validates :prompt, presence: true
    validates :entry, presence: true

    before_validation :set_embedding

    def nearest_neighbor
      nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
        .where(prompt_id:)
        .first
    end

    def nearest_label
      val = nearest_neighbor

      { distance: val&.neighbor_distance, label: val&.label }
    end

    private def set_embedding
      return if entry.blank? || embedding.present?

      self.embedding = Evidence::OpenAI::EmbeddingFetcher.run(dimension: DIMENSION, input: entry, model: MODEL)
    end
  end
end
