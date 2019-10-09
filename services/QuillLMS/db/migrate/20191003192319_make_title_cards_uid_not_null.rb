class MakeTitleCardsUidNotNull < ActiveRecord::Migration
  def change
    change_column_null(:title_cards, :uid, false)
  end
end
