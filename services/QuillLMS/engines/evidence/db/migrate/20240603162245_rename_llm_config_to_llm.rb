class RenameLLMConfigToLLM < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_llm_configs, :evidence_research_gen_ai_llms
    rename_column :evidence_research_gen_ai_trials, :llm_config_id, :llm_id
  end
end
