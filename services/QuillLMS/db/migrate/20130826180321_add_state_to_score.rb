class AddStateToScore < ActiveRecord::Migration
  def change
    add_column :scores, :state, :string, null: false, default: 'unstarted'
  end
end
