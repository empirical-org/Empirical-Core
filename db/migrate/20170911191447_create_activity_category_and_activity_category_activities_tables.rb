class CreateActivityCategoryAndActivityCategoryActivitiesTables < ActiveRecord::Migration
  def change
    create_table :activity_categories do |t|
      t.string :name
      t.integer :order_number
      t.timestamps
    end
    create_table :activity_category_activities do |t|
      t.integer :activity_category_id
      t.integer :activity_id
      t.integer :order_number
      t.timestamps
    end
  end
end
