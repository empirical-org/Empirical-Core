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

      attr_reader :chat, :entry, :prompt

      def initialize(chat:, entry:, prompt:)
        @chat = chat
        @entry = entry
        @prompt = prompt
      end

      def run
        chat.run

        response_object
      end

      private def response_object
        {
          feedback: chat.cleaned_results,
          feedback_type: Evidence::Rule::TYPE_GEN_AI,
          optimal: chat.optimal?,
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
      private def rule_set = chat.optimal? ? RULES_OPTIMAL : RULES_SUBOPTIMAL


      private def highlight_text
        return nil if chat.highlight.nil?

        prompt.distinct_highlight_texts[chat.highlight.to_i - 1]
      end

      private def highlight
        return [] if highlight_text.nil?

        [{
          type: Evidence::Highlight::TYPE_PASSAGE,
          text: highlight_text,
          category: ''
        }]
      end
    end
  end
end
