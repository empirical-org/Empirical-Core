class CreateRecommendations < ActiveRecord::Migration
  def change
    create_table :recommendations do |t|
      t.string :name, length: 150, null: false
      t.references :activity, index: true, foreign_key: true, null: false
      t.references :concept, index: true, foreign_key: true, null: false
      t.references :unit_template, index: true, foreign_key: true, null: false
      t.index :name, unique: true
    end
  end
end
