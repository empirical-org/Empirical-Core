# frozen_string_literal: true

require 'csv'
require 'google/cloud/storage'

module Evidence
  module Research
    module GenAI
      class FooFormatter < ApplicationService
        attr_reader :data, :dataset, :prompt_id

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL

        def initialize(data:, prompt_id:, dataset:)
          @data = data
          @dataset = dataset
          @prompt_id = prompt_id
        end

        def run
          optimal_count = 0
          suboptimal_count = 0
          label_freq = Hash.new(0)

          data.each_with_index do |row, index|
            entry = row[0]&.strip
            label = row[1]

            if entry.blank? || label.blank?
              puts "Row #{index + 1} is missing data"
            else
              label_freq[label] += 1

              if label_freq[label] % 5 == 4
                curriculum_assigned_status = label.start_with?('Optimal') ? OPTIMAL : SUBOPTIMAL
                curriculum_assigned_status == OPTIMAL ? optimal_count += 1 : suboptimal_count += 1

                TestExample.create!(
                  curriculum_assigned_status:,
                  curriculum_label: label,
                  dataset:,
                  student_response: entry
                )
              else
                StoreLabeledEntryWorker.perform_async(entry, label, prompt_id)
              end
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
