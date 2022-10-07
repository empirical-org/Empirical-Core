# frozen_string_literal: true

class ActivityPackSequenceGetter < ApplicationService
  attr_reader :classroom_id, :diagnostic_activity_id, :release_method

  def initialize(classroom_id, diagnostic_activity_id, release_method)
    @classroom_id = classroom_id
    @diagnostic_activity_id = diagnostic_activity_id
    @release_method = release_method
  end

  def run
    destroy_existing_activity_pack_sequences
    activity_pack_sequence
  end

  private def activity_pack_sequence
    return nil unless staggered_release?

    ActivityPackSequence.find_or_create_by!(
      classroom_id: classroom_id,
      diagnostic_activity_id: diagnostic_activity_id,
      release_method:  release_method
    )
  end

  private def destroy_existing_activity_pack_sequences
    return if staggered_release?

    ActivityPackSequence
      .where(classroom_id: classroom_id, diagnostic_activity_id: diagnostic_activity_id)
      .destroy_all
  end

  private def staggered_release?
    release_method == ActivityPackSequence::STAGGERED_RELEASE
  end
end
