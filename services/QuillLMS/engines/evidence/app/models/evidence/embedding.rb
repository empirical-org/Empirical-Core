# frozen_string_literal: true

require 'neighbor'

module Evidence
  class Embedding < ApplicationRecord
    has_neighbors :embeddings, normalize: true

    scope :for_prompt, ->(prompt_id) { where(prompt_id: prompt_id) }

    DISTANCE = "cosine"
    LIMIT = 5
    THRESHOLD = 0.025

    # # Load in a
    # def self.create_from_csv(prompt_id, file_path)
    #   CSV.foreach(file_path) do |row|
    #     debugger
    #   end
    # end

    def self.similar(prompt_id, text, limit = LIMIT)
      embedding = Evidence::OpenAI::Embedding.run(input: text)

      nearest_neighbors(:embeddings, embedding, distance: DISTANCE)
        .for_prompt(prompt_id)
        .limit(limit)
        .map {|e| [e.text, e.label, e.neighbor_distance]}
    end

    def similar(other_prompt_id, limit = LIMIT)
      self.class.nearest_neighbors(:embeddings, embeddings, distance: DISTANCE)
        .for_prompt(other_prompt_id)
        .limit(limit)
        .map {|e| [e.label, e.neighbor_distance, e.text]}
    end

    def closest_label(other_prompt_id)
      self.class.nearest_neighbors(:embeddings, embeddings, distance: DISTANCE)
        .for_prompt(other_prompt_id)
        .first
        .label
    end

    def similar_label(other_prompt_id, limit = LIMIT)
      self.class.nearest_neighbors(:embeddings, embeddings, distance: DISTANCE)
        .for_prompt(other_prompt_id)
        .limit(limit)
        .map {|e| [e.label, e.neighbor_distance]}
        .group_by {|a| a[0]}
        .transform_values {|v| v.sum {|i| 1-i[1]}}
        .max_by {|_,v| v}
        .first
    end

    def popular_label(other_prompt_id, limit = LIMIT)
      labels = self.class.nearest_neighbors(:embeddings, embeddings, distance: DISTANCE)
        .for_prompt(other_prompt_id)
        .limit(limit)
        .map(&:label)

      labels.max_by {|label| labels.count(label)}
    end

    def algorithm_label(other_prompt_id, limit = LIMIT)
      closest = similar(other_prompt_id, 1).first

      if closest[1] < THRESHOLD
        return closest[0]
      end

      similar_label(other_prompt_id, limit)
    end
  end
end
