# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncOrchestratorWorker
    include Sidekiq::Worker

    # NOTE: this worker 'smears' API calls over time to avoid hitting
    # the LearnWorlds 30 requests / 10 seconds rate limit.
    SMEAR_RATE_IN_SECONDS = 1

    def perform
      userwise_subject_areas_relation = LearnWorldsAccount.all.includes(user: { teacher_info: [:subject_areas] } )
      suspended_in_learnworlds =

      # unsuspend users that should be unsuspended
      should_unsuspend =

      # suspend users that should be suspended
      should_suspend = userwise_subject_areas_relation.filter {|x| !x.learn_worlds_access? } || not in suspend list

      # sync tags of all LearnWorldsAccount holders
      userwise_subject_areas_relation = LearnWorldsAccount.all.includes(user: { teacher_info: [:subject_areas] } )
      userwise_subject_areas_relation.find_each.with_index do |row, idx|
        next unless row&.user

        SyncUserTagsWorker.perform_in((idx * SMEAR_RATE_IN_SECONDS).seconds, *marshal(row))
      end
    end

    def marshal(user_subject_area_relation)
      [
        user_subject_area_relation.external_id,
        tags(user_subject_area_relation.user)
      ]
    end

    def string_to_subject_area_tag(str)
      "subject_area_#{str.downcase.gsub(%r{[\s/]+}, '_')}"
    end

    def tags(user)
      subjects_taught = user&.teacher_info&.subject_areas || []

      user_account_type = user.admin? ? 'admin' : 'teacher'

      subjects_taught
        .compact
        .map{ |x| string_to_subject_area_tag(x.name) }
        .append(user_account_type)
    end

  end
end
