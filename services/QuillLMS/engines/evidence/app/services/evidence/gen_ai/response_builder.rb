# frozen_string_literal: true

module Evidence
  module GenAI
    class ResponseBuilder < ApplicationService
      RULES_OPTIMAL = {
        Evidence::Activity::BECAUSE_CONJUNCTION => '35e2312d-ebbf-4408-a83a-5c62913e5d2c',
        Evidence::Activity::BUT_CONJUNCTION     => '26ef0188-9afc-44b2-bd04-470b40d40eca',
        Evidence::Activity::SO_CONJUNCTION      => 'c050fbcc-a69d-4cbb-aaea-79617245eb38'
      }

      RULES_SUBOPTIMAL = {
        Evidence::Activity::BECAUSE_CONJUNCTION => '62c6af4d-fcea-4ea7-b9c6-3e74035f0ce2',
        Evidence::Activity::BUT_CONJUNCTION     => 'ab971a57-5a6a-4ca5-a006-dc632105861f',
        Evidence::Activity::SO_CONJUNCTION      => '1a5383e2-c52e-4b96-9c27-315380008d06'
      }

      KEY_FEEDBACK = 'feedback'
      KEY_OPTIMAL = 'optimal'
      KEY_HIGHLIGHT = 'highlight'

      attr_reader :chat_response, :entry, :prompt

      def initialize(chat_response:, entry:, prompt:)
        @chat_response = chat_response
        @entry = entry
        @prompt = prompt
      end

      def run
        response_object
      end

      private def response_object
        {
          feedback:,
          feedback_type: Evidence::Rule::TYPE_GEN_AI,
          optimal:,
          entry:,
          concept_uid: rule&.concept_uid,
          rule_uid:,
          hint: nil,
          highlight:,
        }
      end

      private def conjunction = prompt.conjunction
      private def rule = Evidence::Rule.find_by(uid: rule_uid)
      private def rule_uid = rule_set[conjunction]
      private def rule_set = optimal ? RULES_OPTIMAL : RULES_SUBOPTIMAL

      private def highlight_array
        return nil if highlight_key.nil?

        prompt.distinct_automl_highlight_arrays[highlight_key.to_i - 1]
      end

      private def highlight = highlight_array.map { |text| { type:, text:, category: '' } }

      private def type = Evidence::Highlight::TYPE_PASSAGE

      private def highlight_key = chat_response[KEY_HIGHLIGHT]
      private def optimal = chat_response[KEY_OPTIMAL]
      private def feedback = chat_response[KEY_FEEDBACK]
    end
  end
end
