# frozen_string_literal: true

class AddGinIndexToUsers < ActiveRecord::Migration[4.2]
  # An index can be created concurrently only outside of a transaction.
  disable_ddl_transaction!

  def up
    execute("CREATE INDEX CONCURRENTLY username_idx ON users USING gin(username gin_trgm_ops);")
  end

  def down
    execute("DROP INDEX users_on_username_idx;")
  end
end
