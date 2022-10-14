# frozen_string_literal: true

class IndependentPracticePacksAssigner < ApplicationService
  attr_reader :assigning_all_recommendations,
    :classroom_id,
    :diagnostic_activity_id,
    :release_method,
    :selections,
    :user

  class TeacherNotAssociatedWithClassroomError < StandardError; end

  def initialize(
    assigning_all_recommendations:,
    classroom_id:,
    diagnostic_activity_id:,
    release_method:,
    selections:,
    user:
  )
    @assigning_all_recommendations = assigning_all_recommendations
    @classroom_id = classroom_id
    @diagnostic_activity_id = diagnostic_activity_id
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

    selections_with_students.each_with_index do |selection, index|
      AssignRecommendationsWorker.perform_async(
        pack_sequence_id: pack_sequence&.id,
        assigning_all_recommendations: assigning_all_recommendations,
        classroom_id: classroom_id,
        is_last_recommendation: index == last_recommendation_index,
        lesson: false,
        order: selection[:order],
        student_ids: selection[:classrooms][0][:student_ids].compact,
        unit_template_id: selection[:id]
      )
    end
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

  private def last_recommendation_index
    @last_selected_recommendation_index ||= selections_with_students.length - 1
  end

  private def selections_with_students
    @selections_with_students ||= selections.select { |ut| ut[:classrooms][0][:student_ids]&.compact&.any? }
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
