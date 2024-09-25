# frozen_string_literal: true

module Evidence
  class StoreLabeledEmbeddingsWorker
    include Evidence.sidekiq_module
    sidekiq_options retry: 1

    def perform(prompt_id, label_data)
      prompt = Evidence::Prompt.find(prompt_id)
      placeholder_feedback = 'placeholder feedback'

      store_embedding(prompt, label_data, placeholder_feedback)
    end

    private def store_embedding(prompt, label_data, placeholder_feedback)
      return if Evidence::PromptResponse.where(response_text: label_data['entry'], prompt_id: prompt.id).exists?

      prompt_response = Evidence::PromptResponse.new(
        response_text: label_data['entry'],
        prompt_id: prompt.id
      )

      Evidence::PromptResponseFeedback.create(
        feedback: placeholder_feedback,
        label: label_data['label'],
        label_transformed: label_data['label_transformed'],
        prompt_response: prompt_response
      )
    end
  end
end
