# frozen_string_literal: true

class AddDurationsToExperiment < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_experiments, :experiment_duration, :float
    add_column :evidence_research_gen_ai_experiments, :evaluation_duration, :float
  end
end
