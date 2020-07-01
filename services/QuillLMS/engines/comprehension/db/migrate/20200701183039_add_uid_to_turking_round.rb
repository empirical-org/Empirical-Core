class AddUidToTurkingRound < ActiveRecord::Migration
  def change
    add_column :comprehension_turking_rounds, :uuid, :uuid
    add_index :comprehension_turking_rounds, :uuid, unique: true
 end
end
