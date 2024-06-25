# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetImporter < ApplicationService
        BUCKET_NAME = ENV['AWS_S3_EVIDENCE_RESEARCH_GEN_AI_BUCKET']

        attr_reader :dataset, :file

        def initialize(dataset:, file:)
          @dataset = dataset
          @file = file
        end

        def run
          optimal_count = 0
          suboptimal_count = 0

          CSV.parse(file.read, headers: true) do |row|
            student_response = row['Student Response']
            data_partition = row['data_partition']
            topic_tag = row['label']
            staff_assigned_status = topic_tag == 'Optimal' ? TestExample::OPTIMAL : TestExample::SUBOPTIMAL
            staff_feedback = row['Proposed Feedback']

            if data_partition == 'test'
              staff_assigned_status == TestExample::OPTIMAL ? optimal_count += 1 : suboptimal_count += 1
              dataset.test_examples.create!(student_response:, staff_assigned_status:, staff_feedback:, topic_tag:)
            elsif data_partition == 'prompt'
              dataset.prompt_examples.create!(student_response:, staff_assigned_status:, staff_feedback:)
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
