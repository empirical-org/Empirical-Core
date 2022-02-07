# frozen_string_literal: true

class AddIsFinalScoreToActivitySessions < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_sessions, :is_final_score, :boolean, default: false
  end
end
