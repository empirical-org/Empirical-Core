# frozen_string_literal: true

require 'fileutils'

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

      class RagLabelFeedbackWorker
        include Sidekiq::Worker

        def perform(entry, label, prompt_id, batch_id, index, total)
          log_to_file("Processing #{index + 1} of #{total}") if (index + 1) % 50 == 0

          label_api = Evidence::OpenAI::Chat
          prompt = Evidence::Prompt.find(prompt_id)

          system_prompt = Evidence::GenAI::LabelFeedback::PromptBuilder.run(prompt: prompt, entry: entry)
          response = label_api.run(system_prompt: system_prompt, entry: entry)

          llm_label = response['label']
          matches = label == llm_label

          result = LabelResult.new(entry: entry, label: label, llm_label: llm_label, matches: matches)
          # log_to_file("#{label} ||| #{llm_label} ||| #{matches}")

          Sidekiq.redis do |conn|
            conn.hset("rag_label_feedback:#{batch_id}", index, result.to_json)
          end
        end

        private

        def log_to_file(message)
          File.open(log_file_path, 'a') do |file|
            file.puts "[#{Time.current}] [Worker] #{message}"
          end
        end

        def log_file_path
          @log_file_path ||= Rails.root.join('log/rag_label_feedback.log')
        end
      end
    end
  end
end
