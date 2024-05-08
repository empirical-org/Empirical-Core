# frozen_string_literal: true

# This migration comes from evidence (originally 20240425125151)
class AddDataPartitionToExampleFeedbacks < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_example_feedbacks,
      :data_partition,
      :string,
      null: false,
      default: Evidence::Research::GenAI::ExampleFeedback::TESTING_DATA
  end
end
