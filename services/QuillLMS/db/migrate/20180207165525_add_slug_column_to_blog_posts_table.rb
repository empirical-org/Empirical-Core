class AddSlugColumnToBlogPostsTable < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :slug, :string
    add_index :blog_posts, :slug, unique: true
  end
end
