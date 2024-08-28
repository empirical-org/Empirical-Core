# frozen_string_literal: true

class AddVisibleToGuidelines < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_guidelines, :visible, :boolean, default: true, null: false
  end
end
