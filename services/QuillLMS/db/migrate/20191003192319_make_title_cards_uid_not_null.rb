# frozen_string_literal: true

class MakeTitleCardsUidNotNull < ActiveRecord::Migration[4.2]
  def change
    change_column_null(:title_cards, :uid, false)
  end
end
