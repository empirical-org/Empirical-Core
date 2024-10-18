# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_labeled_entries
#
#  id                :bigint           not null, primary key
#  approved          :boolean
#  embedding         :vector(1536)     not null
#  entry             :text             not null
#  label             :text             not null
#  label_transformed :text             not null
#  metadata          :jsonb
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  prompt_id         :integer          not null
#
# Indexes
#
#  index_evidence_labeled_entries_on_prompt_id            (prompt_id)
#  index_evidence_labeled_entries_on_prompt_id_and_entry  (prompt_id,entry) UNIQUE
#

require 'neighbor'

module Evidence
  class LabeledEntry < ApplicationRecord
    # Dimension and model are coupled: https://platform.openai.com/docs/guides/embeddings
    DIMENSION = 1536
    MODEL = 'text-embedding-3-small'

    DISTANCE_METRIC = 'cosine'
    COLLAPSED_OPTIMAL_LABEL = 'Optimal'

    OFFSET_AUTOML_ENTRY = 2_000
    OFFSET_SCRAP_DATA = 10_000

    belongs_to :prompt

    has_neighbors :embedding

    validates :embedding, presence: true
    validates :label, presence: true
    validates :label_transformed, presence: true
    validates :prompt_id, presence: true
    validates :entry, presence: true

    before_validation :set_embedding, :set_transformed_label, :set_entry

    def self.closest_prompt_texts(entry:, prompt_id:, limit: 10, dataset_prompt_id: 0)
      find_or_create_by(prompt_id: dataset_prompt_id, entry:)
        .nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
        .where(prompt_id:)
        .limit(limit)
    end

    def nearest_neighbor
      nearest_neighbors(:embedding, distance: DISTANCE_METRIC)
        .where(prompt_id:)
        .first
    end

    def nearest_label
      val = nearest_neighbor

      { distance: val&.neighbor_distance, label: val&.label }
    end

    private def set_entry
      self.entry = entry.strip if entry.present?
    end

    private def set_embedding
      return if entry.blank? || embedding.present?

      self.embedding = Evidence::OpenAI::EmbeddingFetcher.run(dimension: DIMENSION, input: entry, model: MODEL)
    end

    private def set_transformed_label
      if label.present? && label.match?(/\AOptimal_\d+\z/)
        self.label_transformed = COLLAPSED_OPTIMAL_LABEL
      else
        self.label_transformed = label
      end
    end
  end
end
