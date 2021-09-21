class AddUidToTopics < ActiveRecord::Migration[4.2]
  def change
    add_column :topics, :uid, :string
  end
end
