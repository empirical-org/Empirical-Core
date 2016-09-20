class AddRepeatableToActivity < ActiveRecord::Migration
  def change
    add_column :activities, :repeatable, :boolean, default: true
  end
end
