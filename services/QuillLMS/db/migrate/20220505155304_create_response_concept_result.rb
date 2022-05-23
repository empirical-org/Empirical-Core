# frozen_string_literal: true

class CreateResponseConceptResult < ActiveRecord::Migration[5.1]
  def change
    create_table :response_concept_results do |t|
      t.references :concept_result, null: false, foreign_key: true
      t.references :response, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
