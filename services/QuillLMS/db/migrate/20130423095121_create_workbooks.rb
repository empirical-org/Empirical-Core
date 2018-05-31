class CreateWorkbooks < ActiveRecord::Migration
  def change
    create_table :workbooks do |t|
      t.string :title

      t.timestamps
    end
  end
end
