class AddResponseTextIndex < ActiveRecord::Migration[5.1]
  # Need this setting to run index concurrently and not lock tables on large write.
  disable_ddl_transaction!

  def change
    add_index :responses, :text, algorithm: :concurrently
  end
end
