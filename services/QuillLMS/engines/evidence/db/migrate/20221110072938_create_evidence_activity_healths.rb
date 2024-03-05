# frozen_string_literal: true

class CreateEvidenceActivityHealths < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_activity_healths do |t|
      t.string               :name, null: false
      t.string               :flag, null: false
      t.integer              :activity_id, null: false
      t.integer              :version, null: false
      t.integer              :version_plays, null: false
      t.integer              :total_plays, null: false
      t.integer              :completion_rate
      t.integer              :because_final_optimal
      t.integer              :but_final_optimal
      t.integer              :so_final_optimal
      t.integer              :avg_completion_time

      t.timestamps
    end
  end
end
