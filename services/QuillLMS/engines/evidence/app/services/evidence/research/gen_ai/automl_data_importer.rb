# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class AutomlDataImporter < ApplicationService
        BUCKET_NAME = ENV['AWS_S3_EVIDENCE_RESEARCH_GEN_AI_BUCKET']
        TARGET_NUM_EXAMPLES = 100

        attr_reader :file_name

        def initialize(file_name:)
          @file_name = file_name
        end

        def run
          passage_prompts.each do |passage_prompt|
            conjunction = passage_prompt.conjunction
            training_file_name = data['files'][conjunction]['train']
            validation_file_name = data['files'][conjunction]['validation']

            # Training and validation files are artifacts from a previous classification model
            # Here there are both drawn from to populate quill feedbacks
            [training_file_name, validation_file_name].each do |examples_file_name|
              break if passage_prompt.student_responses.count >= TARGET_NUM_EXAMPLES

              get_file(key: examples_file_name).each_line do |line|
                break if passage_prompt.student_responses.count >= TARGET_NUM_EXAMPLES

                example = JSON.parse(line)
                response = example['text']
                label = example['label']
                text = data['feedback'][conjunction][label]
                example_index = data['examples'][conjunction][label]&.index(response)
                paraphrase = example_index ? data.dig('evaluation',conjunction,label,example_index) : nil

                passage_prompt
                  .student_responses
                  .find_or_create_by!(response:)
                  .quill_feedbacks
                  .find_or_create_by!(label:, text:, paraphrase:)
              end
            end
          end
        end

        private def get_file(key:) = s3_client.get_object(bucket: BUCKET_NAME, key:).body

        private def data = @data ||= JSON.parse(input_file)

        private def input_file = get_file(key: file_name).read

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

        private def s3_client
          @s3_client ||= Aws::S3::Client.new(
            access_key_id: ENV['AWS_UPLOADS_ACCESS_KEY_ID'],
            region: ENV['AWS_REGION'],
            secret_access_key: ENV['AWS_UPLOADS_SECRET_ACCESS_KEY']
          )
        end
      end
    end
  end
end
