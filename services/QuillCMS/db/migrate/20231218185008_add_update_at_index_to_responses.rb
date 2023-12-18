class AddUpdateAtIndexToResponses < ActiveRecord::Migration[6.1]
  def change
    add_index :responses, :updated_at
  end
end
