class CreateRawScores < ActiveRecord::Migration
  def change
    create_table :raw_scores do |t|
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
