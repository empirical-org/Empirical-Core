# frozen_string_literal: true

class AddGinIndexToUsersOnName < ActiveRecord::Migration[4.2]
  disable_ddl_transaction!

  def up
    execute("CREATE INDEX CONCURRENTLY name_idx ON users USING gin(name gin_trgm_ops);")
  end

  def down
    execute("DROP INDEX users_on_name_idx;")
  end
end
