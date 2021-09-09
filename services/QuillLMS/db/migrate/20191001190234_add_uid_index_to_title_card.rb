class AddUidIndexToTitleCard < ActiveRecord::Migration[4.2]
  def change
    add_index :title_cards, :uid, unique: true
  end
end
