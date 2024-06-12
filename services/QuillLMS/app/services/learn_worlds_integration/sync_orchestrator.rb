# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncOrchestrator < ApplicationService

    # NOTE: this worker 'smears' API calls over time to avoid hitting
    # the LearnWorlds 30 requests / 10 seconds rate limit.
    SMEAR_RATE_IN_SECONDS = 1

    attr_reader :learnworlds_suspended_ids
    attr_accessor :counter

    def initialize
      @counter = 0
      @learnworlds_suspended_ids = SuspendedUsersRequest.run
    end

    def run
      enqueue_jobs(users_to_unsuspend, UnsuspendUserWorker) {|u| [u.external_id]}
      enqueue_jobs(users_to_suspend, SuspendUserWorker) {|u| [u.external_id]}
      enqueue_jobs(userwise_subject_areas_relation, SyncUserTagsWorker) {|u| marshal(u) }
    end

    def users_to_suspend
      userwise_subject_areas_relation.filter do |row|
        !row.learn_worlds_access? && !learnworlds_suspended_ids.include?(row.external_id)
      end
    end

    def users_to_unsuspend
      userwise_subject_areas_relation.filter do |row|
        row.learn_worlds_access? && learnworlds_suspended_ids.include?(row.external_id)
      end
    end

    def enqueue_jobs(users, worker, &block)

      users.each_with_index do |user, idx|
        worker.perform_in((counter + (idx * SMEAR_RATE_IN_SECONDS)).seconds, *yield(user) )
      end

      self.counter += users.count * SMEAR_RATE_IN_SECONDS
    end

    def userwise_subject_areas_relation
      @users_memo ||= LearnWorldsAccount.all
        .includes(user: { teacher_info: [:subject_areas] } )
        .filter {|row| r&.user }
    end

    def self.marshal(user_subject_area_relation)
      [
        user_subject_area_relation.external_id,
        tags(user_subject_area_relation.user)
      ]
    end

    def self.string_to_subject_area_tag(str)
      "subject_area_#{str.downcase.gsub(%r{[\s/]+}, '_')}"
    end

    def self.tags(user)
      subjects_taught = user&.teacher_info&.subject_areas || []

      user_account_type = user.admin? ? 'admin' : 'teacher'

      subjects_taught
        .compact
        .map{ |x| string_to_subject_area_tag(x.name) }
        .append(user_account_type)
    end

  end
end
