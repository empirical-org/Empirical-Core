class CreateActivitySessionInteractionLogs < ActiveRecord::Migration[4.2]
  def change
    create_table :activity_session_interaction_logs do |t|
      t.datetime :date
      t.jsonb :meta
      t.references :activity_session, :foreign_key => true, :index => true
    end
  end
end
