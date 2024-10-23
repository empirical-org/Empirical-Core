# frozen_string_literal: true

require 'csv'

module Evidence
  module Research
    module GenAI
      class DatasetImporter < ApplicationService
        attr_reader :dataset, :file

        HEADERS = [
          CURRICULUM_ASSIGNED_OPTIMAL_STATUS = 'Curriculum Assigned Optimal Status',
          DATA_PARTITION = 'Data Partition',
          OPTIONAL_AUTOML_LABEL = 'Optional - AutoML Label',
          OPTIONAL_AUTOML_PRIMARY_FEEDBACK = 'Optional - AutoML Primary Feedback',
          OPTIONAL_AUTOML_SECONDARY_FEEDBACK = 'Optional - AutoML Secondary Feedback',
          OPTIONAL_CURRICULUM_LABEL = 'Optional - Curriculum Label',
          CURRICULUM_PROPOSED_FEEDBACK = 'Curriculum Proposed Feedback',
          OPTIONAL_HIGHLIGHT = 'Optional - Highlight',
          STUDENT_RESPONSE = 'Student Response'
        ]

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL

        TEST_DATA = 'test'
        PROMPT_DATA = 'prompt'

        def initialize(dataset:, file:)
          @dataset = dataset
          @file = file
        end

        def run
          optimal_count = 0
          suboptimal_count = 0

          CSV.parse(file.read, headers: true) do |row|
            curriculum_assigned_optimal_status = row[CURRICULUM_ASSIGNED_OPTIMAL_STATUS] == 'TRUE'
            curriculum_assigned_status = curriculum_assigned_optimal_status ? OPTIMAL : SUBOPTIMAL
            data_partition = row[DATA_PARTITION]

            example_attrs = {
              automl_label: row[OPTIONAL_AUTOML_LABEL],
              automl_primary_feedback: row[OPTIONAL_AUTOML_PRIMARY_FEEDBACK],
              automl_secondary_feedback: row[OPTIONAL_AUTOML_SECONDARY_FEEDBACK],
              curriculum_assigned_status:,
              curriculum_label: row[OPTIONAL_CURRICULUM_LABEL],
              curriculum_proposed_feedback: row[CURRICULUM_PROPOSED_FEEDBACK],
              highlight: row[OPTIONAL_HIGHLIGHT],
              student_response: row[STUDENT_RESPONSE]
            }

            if data_partition == TEST_DATA
              curriculum_assigned_status == OPTIMAL ? optimal_count += 1 : suboptimal_count += 1
              dataset.test_examples.create!(example_attrs)
            elsif data_partition == PROMPT_DATA
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
