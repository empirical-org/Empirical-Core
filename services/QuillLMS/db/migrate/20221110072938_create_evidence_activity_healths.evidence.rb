# frozen_string_literal: true
# This migration comes from evidence (originally 20221110063831)

class CreateEvidenceActivityHealths < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_activity_healths do |t|
      t.string               :name
      t.string               :flag
      t.integer              :activity_id
      t.integer              :version
      t.integer              :version_plays
      t.integer              :total_plays
      t.integer              :completion_rate
      t.float                :because_avg_attempts
      t.float                :but_avg_attempts
      t.float                :so_avg_attempts
      t.integer              :avg_completion_time

      t.timestamps
    end
  end
end
