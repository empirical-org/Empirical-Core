class AddParentActivity < ActiveRecord::Migration[4.2]
  def change
    create_table :activities do |t|
      t.string :name
      t.integer :activity_classification_id
    end
  end
end
