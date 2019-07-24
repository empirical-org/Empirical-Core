class AddUidToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :uid, :string
  end
end
