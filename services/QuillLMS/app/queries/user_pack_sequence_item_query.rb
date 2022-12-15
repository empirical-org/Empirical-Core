# frozen_string_literal: true

class UserPackSequenceItemQuery
  FINISHED = ActivitySession::STATE_FINISHED
  COMPLETED_KEY = 'completed'
  PACK_SEQUENCE_ID_KEY = 'pack_sequence_id'
  PACK_SEQUENCE_ITEM_ID_KEY = 'pack_sequence_item_id'

  def self.call(classroom_id, user_id)
    PackSequence
      .staggered
      .select("SUM(CASE WHEN activity_sessions.state = '#{FINISHED}' THEN 1 ELSE 0 END) > 0 AS #{COMPLETED_KEY}")
      .select("pack_sequence_items.id AS #{PACK_SEQUENCE_ITEM_ID_KEY}")
      .select("pack_sequences.id AS #{PACK_SEQUENCE_ID_KEY}")
      .joins(pack_sequence_items: { classroom_unit: { unit: { unit_activities: :activity } } })
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
      .where(classroom_units: { classroom_id: classroom_id, visible: true })
      .where(units: { visible: true })
      .where(unit_activities: { visible: true })
      .group(
        'activities.id',
        'classroom_units.id',
        'pack_sequence_items.id',
        'pack_sequence_items.order',
        'pack_sequences.id',
        'units.id',
        'unit_activities.id'
      )
      .order('pack_sequences.id, pack_sequence_items.order')
  end
end


