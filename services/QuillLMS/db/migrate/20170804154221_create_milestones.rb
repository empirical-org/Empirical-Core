class CreateMilestones < ActiveRecord::Migration
  def change
    create_table :milestones do |t|
      t.string :name, index: true, unique: true, null: false
      t.timestamps
    end
  end
end
