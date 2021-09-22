class AddPgTrgmExtensionToDb < ActiveRecord::Migration[4.2]
  def change
    execute "create extension pg_trgm;"
  end
end
