class AddPremiumToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :premium, :boolean, default: false
  end
end
