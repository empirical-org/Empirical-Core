class CreateMilestones < ActiveRecord::Migration[4.2]
  def change
    create_table :milestones do |t|
      t.string :name, index: true, unique: true, null: false
      t.timestamps
    end
  end
end
