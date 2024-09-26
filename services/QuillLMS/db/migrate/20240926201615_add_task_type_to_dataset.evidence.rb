# frozen_string_literal: true

# This migration comes from evidence (originally 20240926201306)
class AddTaskTypeToDataset < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_datasets, :task_type, :string

    Evidence::Research::GenAI::Dataset.reset_column_information
    Evidence::Research::GenAI::Dataset.find_each do |dataset|
      dataset.update!(task_type: 'generative')
    end

    change_column_null :evidence_research_gen_ai_datasets, :task_type, false
  end
end
