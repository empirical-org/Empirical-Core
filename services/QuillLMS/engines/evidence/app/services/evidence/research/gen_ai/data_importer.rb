# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DataImporter < ApplicationService
        BUCKET_NAME = ENV['AWS_S3_EVIDENCE_RESEARCH_GEN_AI_BUCKET']

        attr_reader :file_name, :activity_prompt_config_id

        def initialize(file_name:, activity_prompt_config_id:)
          @file_name = file_name
          @activity_prompt_config_id = activity_prompt_config_id
        end

        def run
          CSV.parse(get_file(key: file_name), headers: true) do |row|
            response = row['Student Response']
            data_partition = row['Data Partition']
            label = row['Label']
            text = row['Proposed Feedback']

            activity_prompt_config
              .student_responses
              .find_or_create_by!(response:)
              .create_quill_feedback!(label:, text:, data_partition:)
          end
        end

        private def get_file(key:) = s3_client.get_object(bucket: BUCKET_NAME, key:).body

        private def activity_prompt_config = @activity_prompt_config ||= ActivityPromptConfig.find(activity_prompt_config_id)

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
