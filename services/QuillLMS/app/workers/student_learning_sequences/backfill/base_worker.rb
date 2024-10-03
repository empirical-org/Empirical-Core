# frozen_string_literal: true

module StudentLearningSequences
  module Backfill
    class BaseWorker
      include Sidekiq::Worker

      DEFAULT_PAGE_SIZE = 10_000_000

      attr_reader :page, :page_size
  
      def perform(args)
        @page = args.fetch("page", 1)
        @page_size = args.fetch("page_size", DEFAULT_PAGE_SIZE)

        run_backfill
      end

      def run_backfill = (raise NotImplementedError)

      def activity_sessions = ActivitySession.unscoped.where.not(completed_at: nil).order(:id)
      def fetch_page(query) = query.limit(page_size).offset((page - 1) * page_size)
      def pre_diagnostics = Activity.where.not(follow_up_activity_id: nil).where(activity_classification_id: ActivityClassification.diagnostic.id)
      def pre_diagnostic_activity_ids = pre_diagnostics.pluck(:id)
      def post_diagnostic_activity_ids = pre_diagnostics.pluck(:follow_up_activity_id)

      # Used in pre and post backfill child workers
      def classroom_units
        ClassroomUnit.joins(unit_unscoped: :activities)
          .where(unit: { activities: { activity_classification_id: ActivityClassification.diagnostic.id } })
          .select(:id, :assigned_student_ids)
          .order(:id)
      end

      def recommendation_activity_ids
        Activity.joins(unit_templates: :recommendations)
          .where(unit_templates: {recommendations: {activity_id: pre_diagnostic_activity_ids}})
          .pluck(:id)
      end

      def backfill_activity_sessions(query)
        fetch_page(query).find_each do |activity_session|
          Sidekiq::Client.push('class' => StudentLearningSequences::HandleCompletionWorker,
            'queue' => SidekiqQueue::MIGRATION,
            'args' => [activity_session.id]
          )
        end
      end

      def backfill_classroom_units(query)
        fetch_page(query).find_each do |classroom_unit|
          classroom_unit_id = classroom_unit.id
          classroom_unit.assigned_student_ids&.uniq&.compact&.each do |student_id|
            Sidekiq::Client.push('class' => StudentLearningSequences::HandleAssignmentWorker,
              'queue' => SidekiqQueue::MIGRATION,
              'args' => [classroom_unit_id, student_id, true]
            )
          end
        end
      end
    end
  end
end
