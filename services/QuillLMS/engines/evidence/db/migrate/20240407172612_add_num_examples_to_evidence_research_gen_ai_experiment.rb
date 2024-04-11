# frozen_string_literal: true

class AddNumExamplesToEvidenceResearchGenAIExperiment < ActiveRecord::Migration[7.0]
  def up
    add_column :evidence_research_gen_ai_experiments, :num_examples, :integer, default: 0, null: false

    Evidence::Research::GenAI::Experiment
      .all
      .each { |experiment| experiment.update!(num_examples: experiment.llm_feedbacks.count) }
  end

  def down
    remove_column :evidence_research_gen_ai_experiments, :num_examples
  end
end
