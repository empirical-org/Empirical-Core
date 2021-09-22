class ChangeArchivedDefaultForClassrooms < ActiveRecord::Migration[4.2]
  def self.up
    change_table :classrooms do |t|
      t.change :archived, :boolean, default: false
    end
  end
  def self.down
    change_table :tablename do |t|
      t.change :archived, :boolean, default: true
    end
  end
end
