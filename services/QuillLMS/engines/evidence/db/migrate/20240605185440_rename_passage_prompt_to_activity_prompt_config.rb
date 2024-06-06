# frozen_string_literal: true

class RenamePassagePromptToActivityPromptConfig < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_passage_prompts, :evidence_research_gen_ai_activity_prompt_configs
    rename_column :evidence_research_gen_ai_activity_prompt_configs, :instructions, :optimal_rules
    rename_column :evidence_research_gen_ai_activity_prompt_configs, :prompt, :stem
    remove_column :evidence_research_gen_ai_activity_prompt_configs, :relevant_passage, :text
    add_column :evidence_research_gen_ai_activity_prompt_configs, :sub_optimal_rules, :text
    rename_column :evidence_research_gen_ai_student_responses, :passage_prompt_id, :activity_prompt_config_id
    rename_column :evidence_research_gen_ai_trials, :passage_prompt_id, :activity_prompt_config_id

    Evidence::Research::GenAI::ActivityPromptConfig
      .where(sub_optimal_rules: nil)
      .update_all(sub_optimal_rules: 'sub_optimal_rules placeholder')

    change_column_null :evidence_research_gen_ai_activity_prompt_configs, :sub_optimal_rules, false
  end
end
