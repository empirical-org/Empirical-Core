# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DataImporter < ApplicationService
        BUCKET_NAME = ENV['AWS_S3_EVIDENCE_RESEARCH_GEN_AI_BUCKET']

        attr_reader :file_name, :stem_vault_id
        attr_accessor :optimal_count, :suboptimal_count

        def initialize(file_name:, stem_vault_id:)
          @file_name = file_name
          @stem_vault_id = stem_vault_id
          @optimal_count = 0
          @suboptimal_count = 0
        end

        def run
          CSV.parse(get_file(key: file_name), headers: true) do |row|
            student_response = row['Student Response']
            data_partition = row['data_partition']
            topic_tag = row['label']
            staff_assigned_status = topic_tag == 'Optimal' ? TestExample::OPTIMAL : TestExample::SUB_OPTIMAL
            staff_feedback = row['Proposed Feedback']

            if data_partition == 'test'
              staff_assigned_status == TestExample::OPTIMAL ? self.optimal_count += 1 : self.suboptimal_count += 1
              dataset.test_examples.create!(student_response:, staff_assigned_status:, staff_feedback:, topic_tag:)
            elsif data_partition == 'prompt'
              dataset.prompt_examples.create!(student_response:, staff_assigned_status:, staff_feedback:)
            end
          end
          Dataset.where(id: dataset.id).update_all(locked: true, optimal_count:, suboptimal_count:) # HACK: to get around attr_readonly
        end

        private def get_file(key:) = s3_client.get_object(bucket: BUCKET_NAME, key:).body

        private def stem_vault = @stem_vault ||= StemVault.find(stem_vault_id)
        private def dataset = @dataset ||= stem_vault.datasets.create!(locked: false, optimal_count: 0, suboptimal_count: 0)

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
