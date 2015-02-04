class CreateTopicCategories < ActiveRecord::Migration
  def change
    create_table :topic_categories do |t|
    	t.string :name
    	t.timestamps
    end

    add_index :topic_categories, :name
  end
end