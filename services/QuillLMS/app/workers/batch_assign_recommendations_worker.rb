# frozen_string_literal: true

class BatchAssignRecommendationsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(assigning_all_recommendations, pack_sequence_id, selections_with_students)
    return if selections_with_students.empty?

    last_recommendation_index = selections_with_students.length - 1

    batch = Sidekiq::Batch.new
    batch.on(:success, self.class, pack_sequence_id: pack_sequence_id)

    batch.jobs do
      selections_with_students.each_with_index do |selection, index|
        classroom = selection['classrooms'][0]

        AssignRecommendationsWorker.perform_async(
          {
            'assigning_all_recommendations' => assigning_all_recommendations,
            'classroom_id' => classroom['id'],
            'is_last_recommendation' => index == last_recommendation_index,
            'lesson' => false,
            'order' => classroom['order'],
            'pack_sequence_id' => pack_sequence_id,
            'student_ids' => classroom['student_ids'].compact,
            'unit_template_id' => selection['id']
          }
        )
      end
    end
  end

  def on_success(_status, options)
    return if options['pack_sequence_id'].nil?

    PackSequence
      .find(options['pack_sequence_id'])
      &.save_user_pack_sequence_items
  end
end
