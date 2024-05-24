# frozen_string_literal: true

module Evidence
  module GenAI
    class ResponseBuilder < ApplicationService
      RULES_OPTIMAL = {
        Evidence::Activity::BECAUSE_CONJUNCTION => 'asdf',
        Evidence::Activity::BUT_CONJUNCTION     => 'asdf',
        Evidence::Activity::SO_CONJUNCTION      => 'asdf'
      }

      RULES_SUBOPTIMAL = {
        Evidence::Activity::BECAUSE_CONJUNCTION => 'asdf',
        Evidence::Activity::BUT_CONJUNCTION     => 'asdf',
        Evidence::Activity::SO_CONJUNCTION      => 'asdf'
      }

      attr_reader :chat, :entry, :conjunction

      def initialize(chat:, entry:, conjunction:)
        @chat = chat
        @entry = entry
        @conjunction = conjunction
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
          hint: nil
        }
      end

      private def rule = Evidence::Rule.find_by(uid: rule_uid)
      private def rule_uid = rule_set[conjunction]
      private def rule_set = chat.optimal? ? RULES_OPTIMAL : RULES_SUBOPTIMAL
    end
  end
end
