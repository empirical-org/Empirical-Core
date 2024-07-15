# frozen_string_literal: true

require_relative '../../config/environment'

class MigrateIncorrectSequencesAndFocusPoints < Thor
  desc 'add_uid: BATCH_SIZE', 'adds a UID to incorrectSequences and focusPoints if it is not present'
  def add_uid(batch_size)
    ['incorrectSequences', 'focusPoints'].each do |type|
      total_count = Question.where("jsonb_typeof(data->'#{type}') = 'array'").count
      puts "#{type} has #{total_count} questions"

      (0...total_count).step(batch_size = 50) do |offset|
        AddUuidToQuestionDataWorker.perform_async(type, offset, batch_size)
      end
    end
  end
end
