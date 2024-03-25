# frozen_string_literal: true

class AddDefaultValueForExperimentStatus < ActiveRecord::Migration[7.0]
  def up
    change_column_default :evidence_research_gen_ai_experiments, :status, Evidence::Research::GenAI::Experiment::PENDING
  end

  def down
    change_column_default :evidence_research_gen_ai_experiments, :status, nil
  end
end
