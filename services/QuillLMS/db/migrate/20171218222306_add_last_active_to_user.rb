class AddLastActiveToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :last_active, :datetime
  end
end
