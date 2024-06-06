# frozen_string_literal: true

# This migration comes from evidence (originally 20240604230733)
class RenamePassagesToActivities < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_passages, :evidence_research_gen_ai_activities
    rename_column :evidence_research_gen_ai_activities, :contents, :text
    add_column :evidence_research_gen_ai_activities, :because_evidence, :text, null: false, default: ''
    add_column :evidence_research_gen_ai_activities, :but_evidence, :text, null: false, default: ''
    add_column :evidence_research_gen_ai_activities, :so_evidence, :text, null: false, default: ''

    rename_column :evidence_research_gen_ai_passage_prompts, :passage_id, :activity_id
  end
end
