class AddUidToTopicCategories < ActiveRecord::Migration[4.2]
  def change
    add_column :topic_categories, :uid, :string
  end
end
