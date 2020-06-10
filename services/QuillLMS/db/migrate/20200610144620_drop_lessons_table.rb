class DropLessonsTable < ActiveRecord::Migration
  def up
    drop_table :lessons
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
