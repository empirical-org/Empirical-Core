# frozen_string_literal: true

require 'json'

module Evidence
  module Research
    module GenAI
      LabelResult = Data.define(:entry, :label, :llm_label, :matches) do
        def self.from_json(json_string)
          data = JSON.parse(json_string)
          new(
            entry: data['entry'],
            label: data['label'],
            llm_label: data['llm_label'],
            matches: data['matches']
          )
        end

        def to_json(*args)
          {
            entry: entry,
            label: label,
            llm_label: llm_label,
            matches: matches
          }.to_json(*args)
        end
      end

      class RagLabelFeedbackBatchWorker
        include Sidekiq::Worker

        def perform(description, prompt_id, limit, temperature)
          log_to_file("Starting RAG Label Feedback Test: #{description}, prompt_id: #{prompt_id}")
          test_data = Evidence::GenAI::LabelFeedback::DataFetcher.run(prompt_id:)
          limit = limit&.to_i
          test_data = test_data.take(limit) if limit
          total = test_data.size

          batch = Sidekiq::Batch.new
          batch.description = "RAG Label Feedback Test: #{description}"
          batch.on(:complete, self.class, 'batch_complete')
          batch.jobs do
            test_data.each_with_index do |data, index|
              RagLabelFeedbackWorker.perform_async(
                data.entry, data.label_transformed, prompt_id, batch.bid, index, total
              )
            end
          end
          log_to_file("Enqueued #{test_data.size} jobs for processing")
        end

        def on_complete(status, options)
          batch_id = status.bid
          log_to_file("Batch #{batch_id} complete, processing results")
          results = []
          Sidekiq.redis do |conn|
            conn.hgetall("rag_label_feedback:#{batch_id}").each do |_, result_json|
              results << LabelResult.from_json(result_json)
            end
          end

          output_file = label_output_file(results.size)
          CSV.open(output_file, 'wb') do |csv|
            csv << LabelResult.members.map(&:to_s)
            results.each { |data| csv << data.deconstruct }
          end
          log_to_file("Results written to #{output_file}")

          correct_count = results.count { |result| result.matches }
          accuracy = correct_count.to_f / results.size
          log_to_file("Correct: #{correct_count} / #{results.size}: #{accuracy.round(4)}")

          # Clean up Redis after processing
          Sidekiq.redis { |conn| conn.del("rag_label_feedback:#{batch_id}") }
          log_to_file("Cleanup complete for batch #{batch_id}")
        end

        private

        def label_output_file(limit)
          dir_path = Rails.root.join('lib/data').to_s
          FileUtils.mkdir_p(dir_path) unless File.directory?(dir_path)
          File.join(dir_path, "label_feedback_#{limit}_#{Time.now.to_i}.csv")
        end

        def log_to_file(message)
          File.open(log_file_path, 'a') do |file|
            file.puts "[#{Time.now}] [BatchWorker] #{message}"
          end
        end

        def log_file_path
          @log_file_path ||= Rails.root.join('log/rag_label_feedback.log')
        end
      end
    end
  end
end
