class RemoveQueueClassic < ActiveRecord::Migration
  def change
    execute "DROP TABLE queue_classic_jobs CASCADE"
  end
end
