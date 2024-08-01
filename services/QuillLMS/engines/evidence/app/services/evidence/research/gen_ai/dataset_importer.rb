# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetImporter < ApplicationService
        attr_reader :dataset, :file

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL

        def initialize(dataset:, file:)
          @dataset = dataset
          @file = file
        end

        def run
          optimal_count = 0
          suboptimal_count = 0

          CSV.parse(file.read, headers: true) do |row|
            curriculum_assigned_optimal_status = row['Curriculum Assigned Optimal Status'] == 'TRUE'
            curriculum_assigned_status = curriculum_assigned_optimal_status ? OPTIMAL : SUBOPTIMAL
            data_partition = row['Data Partition']

            example_attrs = {
              automl_label: row['Optional - AutoML Label'],
              automl_primary_feedback: row['Optional - AutoML Primary Feedback'],
              automl_secondary_feedback: row['Optional - AutoML Secondary Feedback'],
              curriculum_assigned_status:,
              curriculum_label: row['Optional - Curriculum Label'],
              curriculum_proposed_feedback: row['Curriculum Proposed Feedback'],
              highlight: row['Optional - Highlight'],
              student_response: row['Student Response']
            }

            if data_partition == 'test'
              curriculum_assigned_status == HasAssignedStatus::OPTIMAL ? optimal_count += 1 : suboptimal_count += 1
              dataset.test_examples.create!(example_attrs)
            elsif data_partition == 'prompt'
              dataset.prompt_examples.create!(example_attrs)
            end
          end

          Dataset
            .where(id: dataset.id)
            .update_all(locked: true, optimal_count:, suboptimal_count:) # HACK: to get around attr_readonly
        end
      end
    end
  end
end
