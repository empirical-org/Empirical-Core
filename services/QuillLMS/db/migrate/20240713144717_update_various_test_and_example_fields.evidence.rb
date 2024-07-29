# frozen_string_literal: true

# This migration comes from evidence (originally 20240713141016)
class UpdateVariousTestAndExampleFields < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_research_gen_ai_test_examples, :staff_assigned_status, :curriculum_assigned_status
    rename_column :evidence_research_gen_ai_test_examples, :staff_feedback, :curriculum_proposed_feedback
    rename_column :evidence_research_gen_ai_test_examples, :topic_tag, :curriculum_label
    rename_column :evidence_research_gen_ai_test_examples, :automl_status, :automl_label
    rename_column :evidence_research_gen_ai_test_examples, :automl_feedback, :automl_primary_feedback

    add_column :evidence_research_gen_ai_test_examples, :automl_secondary_feedback, :text

    rename_column :evidence_research_gen_ai_prompt_examples, :staff_assigned_status, :curriculum_assigned_status
    rename_column :evidence_research_gen_ai_prompt_examples, :staff_feedback, :curriculum_proposed_feedback

    add_column :evidence_research_gen_ai_prompt_examples, :curriculum_label, :string
    add_column :evidence_research_gen_ai_prompt_examples, :highlight, :text
    add_column :evidence_research_gen_ai_prompt_examples, :automl_label, :text
    add_column :evidence_research_gen_ai_prompt_examples, :automl_primary_feedback, :text
    add_column :evidence_research_gen_ai_prompt_examples, :automl_secondary_feedback, :text

    rename_column :evidence_research_gen_ai_guidelines, :staff_assigned_status, :curriculum_assigned_status
  end
end
