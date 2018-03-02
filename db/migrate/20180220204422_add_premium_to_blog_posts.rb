class AddPremiumToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :premium, :boolean, default: false
  end
end
