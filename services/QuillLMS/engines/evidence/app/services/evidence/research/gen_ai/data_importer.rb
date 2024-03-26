# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DataImporter < ApplicationService
        TARGET_NUM_EXAMPLES = 100

        attr_reader :file_path, :file_name, :examples_path

        def initialize(file_path:, file_name:, examples_path:)
          @file_path = file_path
          @file_name = file_name
          @examples_path = examples_path
        end

        # rubocop:disable Metrics/CyclomaticComplexity
        def run
          passage_prompts.each do |passage_prompt|
            conjunction = passage_prompt.conjunction
            training_file_name = data['files'][conjunction]['train'].split('/').last
            validation_file_name = data['files'][conjunction]['validation'].split('/').last

            # Training and validation files are artifacts from a previous classification model
            # Here there are both drawn from to populate example feedbacks
            [training_file_name, validation_file_name].each do |examples_file_name|
              break if passage_prompt.passage_prompt_responses.count >= TARGET_NUM_EXAMPLES

              examples_file_abs_path = File.join(examples_path, examples_file_name)
              next unless File.exist?(examples_file_abs_path)

              File.open(examples_file_abs_path, 'r') do |file|
                file.each_line do |line|
                  break if passage_prompt.passage_prompt_responses.count >= TARGET_NUM_EXAMPLES

                  example = JSON.parse(line)
                  response = example['text']
                  label = example['label']
                  feedback = data['feedback'][conjunction][label]
                  example_index = data['examples'][conjunction][label]&.index(response)
                  evaluation = example_index ? data.dig('evaluation',conjunction,label,example_index) : nil

                  passage_prompt
                    .passage_prompt_responses
                    .find_or_create_by!(response:)
                    .example_prompt_response_feedbacks
                    .find_or_create_by!(label:, feedback:, evaluation:)
                end
              end
            end
          end
        end
        # rubocop:enable Metrics/CyclomaticComplexity

        private def data = @data ||= JSON.parse(input_file)

        private def file_abs_path = File.join(file_path, file_name)

        private def input_file = File.read(file_abs_path)

        private def name = file_name.split('.').first

        private def passage = @passage ||= Passage.find_or_create_by!(contents: data['text'], name:)

        private def passage_prompts
          @passage_prompts ||= data['prompts'].map do |conjunction, prompt|
            passage
              .passage_prompts
              .find_or_create_by!(
                conjunction:,
                instructions: data['instructions'][conjunction],
                prompt:,
                relevant_passage: data['plagiarism'][conjunction]
              )
          end
        end
      end
    end
  end
end