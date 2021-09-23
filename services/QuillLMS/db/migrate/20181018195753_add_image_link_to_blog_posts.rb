class AddImageLinkToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :image_link, :string
  end
end
