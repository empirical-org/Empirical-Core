class AddParentActivity < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :name
      t.integer :activity_classification_id
    end
  end
end
