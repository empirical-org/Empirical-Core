# frozen_string_literal: true

class RenameActivityPromptConfigToStemVault < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_activity_prompt_configs, :evidence_research_gen_ai_stem_vaults
    remove_column :evidence_research_gen_ai_stem_vaults, :optimal_rules, :text
    remove_column :evidence_research_gen_ai_stem_vaults, :sub_optimal_rules, :text
    rename_column :evidence_research_gen_ai_student_responses, :activity_prompt_config_id, :stem_vault_id
    rename_column :evidence_research_gen_ai_trials, :activity_prompt_config_id, :stem_vault_id
  end
end
