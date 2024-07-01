# frozen_string_literal: true

# This migration comes from evidence (originally 20240626142847)
class RenameGuidelineCategory < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_research_gen_ai_guidelines, :category, :staff_assigned_status
  end
end
