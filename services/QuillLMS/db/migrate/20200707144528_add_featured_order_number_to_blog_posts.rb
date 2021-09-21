class AddFeaturedOrderNumberToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :featured_order_number, :integer
  end
end
