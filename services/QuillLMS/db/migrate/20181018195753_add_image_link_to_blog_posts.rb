class AddImageLinkToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :image_link, :string
  end
end
