class AddFooToActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :activities, :foo, :string, default: 'a_value'
  end
end
