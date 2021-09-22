class AddHstore < ActiveRecord::Migration[4.2]
  def up
    execute 'CREATE EXTENSION IF NOT EXISTS hstore'
  end

  def down
    execute 'DROP EXTENSION IF EXISTS hstore'
  end
end
