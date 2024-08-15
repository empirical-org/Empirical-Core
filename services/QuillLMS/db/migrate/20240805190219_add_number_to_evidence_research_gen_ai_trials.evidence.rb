# frozen_string_literal: true

# This migration comes from evidence (originally 20240805185650)
class AddNumberToEvidenceResearchGenAITrials < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_trials, :number, :integer

    Evidence::Research::GenAI::Trial.reset_column_information

    Evidence::Research::GenAI::Trial.order(:dataset_id, :created_at).group_by(&:dataset_id).each do |dataset_id, trials|
      trials.each_with_index do |trial, index|
        trial.update_column(:number, index + 1)
      end
    end

    # Now that the column is filled, make it non-nullable
    change_column_null :evidence_research_gen_ai_trials, :number, false
  end
end
