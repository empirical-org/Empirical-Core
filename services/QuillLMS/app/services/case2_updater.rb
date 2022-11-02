# frozen_string_literal: true

class Case2Updater < ApplicationService
  attr_reader :activity_session

  delegate :classroom, :user_id, to: :activity_session

  FINISHED = ActivitySession::STATE_FINISHED
  COMPLETED_KEY = 'completed'

  def initialize(activity_session)
    @activity_session = activity_session
  end

  def run
    blah
  end

  private def blah
    results =
      PackSequence
        .staggered
        .select("SUM(CASE WHEN activity_sessions.state = '#{FINISHED}' THEN 1 ELSE 0 END) > 0 AS #{COMPLETED_KEY}")
        .includes(:pack_sequence_items)
        .joins(pack_sequence_items: { unit: :classroom_units })
        .joins(pack_sequence_items: { unit: { unit_activities: :activity } } )
        .left_outer_joins(:user_pack_sequence_items)
        .joins(
          <<-SQL
            LEFT JOIN activity_sessions
              ON activity_sessions.classroom_unit_id = classroom_units.id
              AND activity_sessions.activity_id = unit_activities.activity_id
              AND activity_sessions.visible = true
              AND activity_sessions.user_id = #{user_id}
          SQL
        )
        .where("#{user_id} = ANY (classroom_units.assigned_student_ids::int[])")
        .where(classroom_units: { classroom: classroom, visible: true })
        .where(units: { visible: true })
        .where(unit_activities: { visible: true })
        .group(
          'activities.id',
          'classroom_units.id',
          'pack_sequence_items.id',
          'pack_sequences.id',
          'units.id',
          'unit_activities.id'
        )
  end
end


