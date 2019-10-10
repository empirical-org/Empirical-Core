class AddUidIndexToTitleCard < ActiveRecord::Migration
  def change
    add_index :title_cards, :uid, unique: true
  end
end
