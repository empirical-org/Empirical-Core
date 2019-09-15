class AddResponseCountIndex < ActiveRecord::Migration[5.1]
  def change
    add_index :responses, :count
  end
end
