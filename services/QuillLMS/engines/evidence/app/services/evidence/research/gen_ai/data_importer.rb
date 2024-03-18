# frozen_s

module Evidence
  module Research
    module GenAI
      class DataImporter < ApplicationService
        attr_reader :file_path, :file_name, :examples_path

        def initialize(file_path:, file_name:, examples_path:)
          @file_path = file_path
          @file_name = file_name
          @examples_path = examples_path
        end

        def run
          passage_prompts.each do |passage_prompt|
            conjunction = passage_prompt.conjunction
            training_file_name = data['files'][conjunction]['train'].split('/').last
            validation_file_name = data['files'][conjunction]['validation'].split('/').last

            [training_file_name, validation_file_name].each do |examples_file_name|
              break if passage_prompt.passage_prompt_responses.count >= 100

              examples_file_abs_path = File.join(examples_path, examples_file_name)
              next unless File.exist?(examples_file_abs_path)

              File.open(examples_file_abs_path, 'r') do |file|
                file.each_line do |line|
                  break if passage_prompt.passage_prompt_responses.count >= 100

                  example = JSON.parse(line)
                  response = example['text']
                  label = example['label']
                  feedback = data['feedback'][conjunction][label]

                  passage_prompt
                    .passage_prompt_responses
                    .find_or_create_by!(response:)
                    .example_prompt_response_feedbacks
                    .find_or_create_by!(label:, feedback:)
                end
              end
            end
          end
        end

        private def data = @data ||= JSON.parse(input_file)

        private def file_abs_path = File.join(file_path, file_name)

        private def input_file = File.read(file_abs_path)

        private def name = file_name.split('.').first

        private def passage = @passage ||= Passage.find_or_create_by!(contents: data['text'], name:)

        private def passage_prompts
          @passage_prompts ||= data['prompts'].map do |conjunction, prompt|
            passage
              .passage_prompts
              .find_or_create_by!(conjunction:, prompt:, instructions: data['instructions'][conjunction])
          end
        end
      end
    end
  end
end
