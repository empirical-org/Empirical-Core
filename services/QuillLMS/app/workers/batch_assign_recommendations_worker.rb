# frozen_string_literal: true

class BatchAssignRecommendationsWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(assigning_all_recommended_packs, pack_sequence_id, selections_with_students)
    return if selections_with_students.empty?

    last_recommendation_index = selections_with_students.length - 1

    batch_runner(pack_sequence_id) do
      selections_with_students.each_with_index do |selection, index|
        classroom = selection['classrooms'][0]

        AssignRecommendationsWorker.perform_async(
          {
            'assigning_all_recommended_packs' => assigning_all_recommended_packs,
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
    PackSequence
      .find_by(id: options['pack_sequence_id'])
      &.save_user_pack_sequence_items
  end

  private def batch_runner(pack_sequence_id, &assign_recommendations)
    if pack_sequence_id.nil?
      assign_recommendations.call
    else
      batch = Sidekiq::Batch.new
      batch.description = 'Assigning Recommendations with Pack Sequence'
      batch.callback_queue = SidekiqQueue::CRITICAL
      batch.on(:success, self.class, pack_sequence_id: pack_sequence_id)
      batch.jobs { assign_recommendations.call }
    end
  end
end
