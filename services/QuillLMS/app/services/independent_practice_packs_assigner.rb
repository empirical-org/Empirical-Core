# frozen_string_literal: true

class IndependentPracticePacksAssigner < ApplicationService
  attr_reader :assigning_all_recommended_packs,
    :classroom_id,
    :diagnostic_activity_id,
    :release_method,
    :selections,
    :user

  class TeacherNotAssociatedWithClassroomError < StandardError; end

  def initialize(
    assigning_all_recommended_packs:,
    classroom_id:,
    diagnostic_activity_id:,
    release_method:,
    selections:,
    user:
  )
    @assigning_all_recommended_packs = assigning_all_recommended_packs
    @classroom_id = classroom_id.to_i
    @diagnostic_activity_id = diagnostic_activity_id.to_i
    @release_method = release_method
    @selections = selections
    @user = user
  end

  def run
    raise TeacherNotAssociatedWithClassroomError unless teaches_classroom?

    find_or_create_activity_packs

    return if selections_with_students.empty?

    set_diagnostic_recommendations_start_time
    destroy_existing_pack_sequences
    assign_recommendations
  end

  private def pack_sequence_getter
    PackSequence.find_or_create_by!(
      classroom_id: classroom_id,
      diagnostic_activity_id: diagnostic_activity_id,
      release_method:  release_method
    )
  end

  private def assign_recommendations
    pack_sequence = staggered_release? ? pack_sequence_getter : nil

    BatchAssignRecommendationsWorker.perform_async(
      assigning_all_recommended_packs,
      pack_sequence&.id,
      selections_with_students
    )
  end

  private def destroy_existing_pack_sequences
    return if staggered_release?

    PackSequence
      .where(classroom_id: classroom_id, diagnostic_activity_id: diagnostic_activity_id)
      .destroy_all
  end

  private def find_or_create_activity_packs
    ActiveRecord::Base.transaction do
      selections
        .map { |selection| UnitTemplate.find(selection['id']) }
        .each { |ut| Unit.unscoped.find_or_create_by!(unit_template: ut, name: ut.name, user: user) }
    end
  end

  private def selections_with_students
    @selections_with_students ||= begin
      selections
        .select { |selection| selection[:classrooms][0][:student_ids]&.compact&.any? }
        .map { |selection| selection.permit(:id, classrooms: [:id, :order, student_ids: []]).to_h }
    end
  end

  private def set_diagnostic_recommendations_start_time
    $redis.set("user_id:#{user.id}_diagnostic_recommendations_start_time", Time.current)
  end

  private def staggered_release?
    release_method == PackSequence::STAGGERED_RELEASE
  end

  private def teaches_classroom?
    classroom_id.in?(user.classrooms_i_teach.pluck(:id))
  end
end
