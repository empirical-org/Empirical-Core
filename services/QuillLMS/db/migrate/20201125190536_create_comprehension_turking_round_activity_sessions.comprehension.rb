# frozen_string_literal: true

# This migration comes from comprehension (originally 20201125161727)
class CreateComprehensionTurkingRoundActivitySessions < ActiveRecord::Migration[4.2]
  def change
    create_table :comprehension_turking_round_activity_sessions do |t|
      t.integer :turking_round_id
      t.string :activity_session_uid

      t.timestamps null: false
    end

    add_index :comprehension_turking_round_activity_sessions, :turking_round_id,
      name: 'comprehension_turking_sessions_turking_id'
    add_index :comprehension_turking_round_activity_sessions, :activity_session_uid, unique: true,
      name: 'comprehension_turking_sessions_activity_uid'
  end
end
