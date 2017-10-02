class AddGinIndexToUsersEmail < ActiveRecord::Migration
  # An index can be created concurrently only outside of a transaction.
  disable_ddl_transaction!

  def up
    execute("CREATE INDEX CONCURRENTLY email_idx ON users USING gin(email gin_trgm_ops);")
  end

  def down
    execute("DROP INDEX users_on_email_idx;")
  end
end
