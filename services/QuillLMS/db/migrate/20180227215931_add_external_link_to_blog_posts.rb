class AddExternalLinkToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :external_link, :string
  end
end
