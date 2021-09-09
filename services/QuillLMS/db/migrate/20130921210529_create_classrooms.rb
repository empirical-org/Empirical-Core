class CreateClassrooms < ActiveRecord::Migration[4.2]
  def change
    create_table :classrooms do |t|
      t.string :name
      t.string :code
      t.belongs_to :teacher

      t.timestamps
    end
  end
end
