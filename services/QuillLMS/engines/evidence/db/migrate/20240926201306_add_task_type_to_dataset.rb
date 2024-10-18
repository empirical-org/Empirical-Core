# frozen_string_literal: true

class AddTaskTypeToDataset < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_datasets, :task_type, :string

    Evidence::Research::GenAI::Dataset.reset_column_information
    Evidence::Research::GenAI::Dataset.find_each do |dataset|
      dataset.update!(task_type: 'generative')
    end
  end
end
