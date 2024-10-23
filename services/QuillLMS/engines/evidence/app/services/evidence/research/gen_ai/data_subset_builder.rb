# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DataSubsetBuilder < ApplicationService
        attr_reader :parent_id, :test_example_ids

        def initialize(parent_id:, test_example_ids:)
          @parent_id = parent_id
          @test_example_ids = test_example_ids
        end

        def run
          ActiveRecord::Base.transaction do
            copy_prompt_examples
            copy_selected_test_examples
            finalize_data_subset
          end
          data_subset.reload
        end

        private def data_subset = @data_subset ||= Dataset.create!(parent_id:, stem_vault_id:, task_type:)
        private def parent_dataset = @parent_dataset ||= Dataset.find(parent_id)
        private def stem_vault_id = parent_dataset.stem_vault_id
        private def task_type = parent_dataset.task_type

        private def copy_prompt_examples
          parent_dataset.prompt_examples.find_each do |prompt_example|
            data_subset.prompt_examples.create!(prompt_example.attributes.except('id', 'dataset_id'))
          end
        end

        private def copy_selected_test_examples
          parent_dataset.test_examples.where(id: test_example_ids).find_each do |test_example|
            data_subset.test_examples.create!(test_example.attributes.except('id', 'dataset_id'))
          end
        end

        private def finalize_data_subset
          optimal_count, suboptimal_count = data_subset.test_examples.partition(&:optimal?).map(&:count)

          Dataset
            .where(id: data_subset.id)
            .update_all(locked: true, optimal_count:, suboptimal_count:)
        end
      end
    end
  end
end
