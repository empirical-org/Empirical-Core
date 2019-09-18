class AddResponseCountIndex < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :responses, :count, algorithm: :concurrently
  end
end
