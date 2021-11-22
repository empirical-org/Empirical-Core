# frozen_string_literal: true

class AddPinnedToClassroomActivity < ActiveRecord::Migration[4.2]
  def change
    add_column :classroom_activities, :pinned, :boolean, :default => false
    add_index :classroom_activities, [:classroom_id, :pinned], where: "pinned = true", unique: true
  end
end
