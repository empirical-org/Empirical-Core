# frozen_string_literal: true

class CreateResponsesConcepts < ActiveRecord::Migration[5.1]
  def change
    create_table :responses_concepts do |t|
      t.references :concept, null: false, foreign_key: true
      t.references :response, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
