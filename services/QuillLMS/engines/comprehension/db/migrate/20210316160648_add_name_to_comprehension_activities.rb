class AddNameToComprehensionActivities < ActiveRecord::Migration
  def change
    add_column :comprehension_activities, :name, :string
  end
end
