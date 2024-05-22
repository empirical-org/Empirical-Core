# frozen_string_literal: true

module LearnWorldsIntegration
  module Webhooks
    class AccountCourseEventHandler < ApplicationService
      attr_reader :data

      def initialize(data)
        @data = data
      end

      def run
        LearnWorldsAccountCourseEvent.find_or_create_by!(
          learn_worlds_account: learn_worlds_account,
          learn_worlds_course: learn_worlds_course,
          event_type: event_type
        )
      end

      private def account_external_id
        data.dig('user', 'id')
      end

      private def learn_worlds_account
        LearnWorldsAccount.find_by!(external_id: account_external_id)
      end
    end
  end
end
