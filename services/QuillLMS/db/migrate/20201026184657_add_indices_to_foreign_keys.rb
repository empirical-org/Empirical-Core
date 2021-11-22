# frozen_string_literal: true

class AddIndicesToForeignKeys < ActiveRecord::Migration[4.2]
  def change
    add_index :teacher_saved_activities, :activity_id
    add_index :teacher_saved_activities, :teacher_id
    add_index :activities, :raw_score_id
    add_index :content_partner_activities, :content_partner_id
    add_index :content_partner_activities, :activity_id
  end
end
