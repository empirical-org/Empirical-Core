class AddTypeToTitleCard < ActiveRecord::Migration[4.2]
  def up
    add_column :title_cards, :title_card_type, :string
    add_index :title_cards, :title_card_type
    TitleCard.update_all(title_card_type: 'connect_title_card')
    change_column_null :title_cards, :title_card_type, false
  end
  def down
    remove_column :title_cards, :title_card_type
  end
end
