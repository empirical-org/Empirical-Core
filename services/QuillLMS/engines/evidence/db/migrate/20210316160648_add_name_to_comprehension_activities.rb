class AddNameToComprehensionActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_activities, :name, :string
  end
end
