class DropLessonsTable < ActiveRecord::Migration[4.2]
  def up
    drop_table :lessons
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
