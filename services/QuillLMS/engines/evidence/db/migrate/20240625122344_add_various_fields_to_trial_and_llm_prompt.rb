# frozen_string_literal: true

class AddVariousFieldsToTrialAndLLMPrompt < ActiveRecord::Migration[7.0]
  def change
    remove_column :evidence_research_gen_ai_trials, :num_examples, :integer
    rename_column :evidence_research_gen_ai_trials, :stem_vault_id, :dataset_id

    add_column :evidence_research_gen_ai_llm_prompts, :optimal_guidelines_count, :integer
    add_column :evidence_research_gen_ai_llm_prompts, :suboptimal_guidelines_count, :integer
    add_column :evidence_research_gen_ai_llm_prompts, :optimal_examples_count, :integer
    add_column :evidence_research_gen_ai_llm_prompts, :suboptimal_examples_count, :integer
    add_column :evidence_research_gen_ai_llm_prompts, :locked, :boolean

    Evidence::Research::GenAI::LLMPrompt.update_all(
      optimal_guidelines_count: 0,
      suboptimal_guidelines_count: 0,
      optimal_examples_count: 0,
      suboptimal_examples_count: 0,
      locked: true
    )

    change_column_null :evidence_research_gen_ai_llm_prompts, :optimal_guidelines_count, false
    change_column_null :evidence_research_gen_ai_llm_prompts, :suboptimal_guidelines_count, false
    change_column_null :evidence_research_gen_ai_llm_prompts, :optimal_examples_count, false
    change_column_null :evidence_research_gen_ai_llm_prompts, :suboptimal_examples_count, false
    change_column_null :evidence_research_gen_ai_llm_prompts, :locked, false
  end
end
