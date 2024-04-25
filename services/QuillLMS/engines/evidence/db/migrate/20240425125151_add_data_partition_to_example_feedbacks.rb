# frozen_string_literal: true

class AddDataPartitionToExampleFeedbacks < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_example_feedbacks,
      :data_partition,
      :string,
      null: false,
      default: Evidence::Research::GenAI::ExampleFeedback::TEST_DATA
  end
end
