class AddExternalLinkToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :external_link, :string
  end
end
