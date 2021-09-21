class AddOrderNumberToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :order_number, :integer
  end
end
