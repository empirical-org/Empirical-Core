# frozen_string_literal: true

class AddNotesToTrial < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_trials, :notes, :text
  end
end
