class AddFeaturedOrderNumberToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :featured_order_number, :integer
  end
end
