# frozen_string_literal: true

class CreateUserActivityClassification < ActiveRecord::Migration[5.1]
  def change
    create_table :user_activity_classifications do |t|
      t.references :user, index: true, foreign_key: true
      t.references :activity_classification, index: { name: 'index_user_activity_classifications_on_classifications' }, foreign_key: true
      t.integer :count, default: 0
    end
    add_index :user_activity_classifications, [:user_id, :activity_classification_id], unique: true, name: 'user_activity_classification_unique_index'
  end
end
