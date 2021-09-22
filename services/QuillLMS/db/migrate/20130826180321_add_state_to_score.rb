class AddStateToScore < ActiveRecord::Migration[4.2]
  def change
    add_column :scores, :state, :string, null: false, default: 'unstarted'
  end
end
