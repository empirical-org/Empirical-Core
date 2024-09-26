# frozen_string_literal: true

require 'csv'
require 'google/cloud/storage'

module Evidence
  module Research
    module GenAI
      class FooFormatter < ApplicationService
        attr_reader :data, :prompt_id, :label_freq

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL

        def initialize(data:, prompt_id:)
          @data = data
          @prompt_id = prompt_id
          @label_freq = Hash.new(0)
        end

        def run
          data.each_with_index do |row, index|
            if row[0].blank? || row[1].blank?
              puts "Row #{index + 1} is missing data"
            else
              entry = row[0]
              label = row[1]
              label_freq[label] += 1
              if label_freq[label] % 5 == 4
                LabeledEntry.create!(entry:, label:, prompt_id:)
              else
                TestExample.create!(entry: entry, label: label, prompt_id: prompt_id)
              end

              # else
              #   type = index % 5 == 4 ? 'test' : 'prompt'
              #   row.unshift(type)
            end
          end
        end
      end
    end
  end
end
