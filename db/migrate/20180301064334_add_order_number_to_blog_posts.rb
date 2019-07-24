class AddOrderNumberToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :order_number, :integer
  end
end
