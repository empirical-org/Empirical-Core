class AddUidToTopicCategories < ActiveRecord::Migration
  def change
    add_column :topic_categories, :uid, :string
  end
end
