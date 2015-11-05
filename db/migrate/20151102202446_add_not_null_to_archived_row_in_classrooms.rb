class AddNotNullToArchivedRowInClassrooms < ActiveRecord::Migration
  def self.up
    change_table :classrooms do |t|
      t.change :archived, :boolean, null: false, default: false
    end
  end
  def self.down
    change_table :classrooms do |t|
      t.change :archived, :boolean, default: false
    end
  end
end
